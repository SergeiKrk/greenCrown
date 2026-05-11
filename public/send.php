<?php

ini_set('display_errors', 0);
error_reporting(0);

$config = require __DIR__ . '/private/config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'libs/PHPMailer/src/Exception.php';
require 'libs/PHPMailer/src/PHPMailer.php';
require 'libs/PHPMailer/src/SMTP.php';

/*
|--------------------------------------------------------------------------
| Только POST
|--------------------------------------------------------------------------
*/
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    exit;
}

/*
|--------------------------------------------------------------------------
| Ограничение размера POST
|--------------------------------------------------------------------------
*/
if (
    isset($_SERVER['CONTENT_LENGTH']) &&
    $_SERVER['CONTENT_LENGTH'] > 5000
) {
    http_response_code(413);
    exit;
}

/*
|--------------------------------------------------------------------------
| Honeypot (боты часто заполняют скрытые поля)
|--------------------------------------------------------------------------
*/
if (!empty($_POST['website'])) {
    http_response_code(403);
    exit;
}

/*
|--------------------------------------------------------------------------
| Проверка времени заполнения формы
| (антибот: слишком быстро = бот)
|--------------------------------------------------------------------------
*/
if (!isset($_POST['form_time'])) {
    http_response_code(403);
    exit;
}

$formTime = (int) $_POST['form_time'];
$currentTime = (int) round(microtime(true) * 1000);

if (($currentTime - $formTime) < 3000) {
    http_response_code(403);
    exit;
}

/*
|--------------------------------------------------------------------------
| Проверка origin / referer (мягкая, без блокировки реальных пользователей)
|--------------------------------------------------------------------------
*/
$allowedDomains = [
    'https://green-crown.ru',
    'https://www.green-crown.ru'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';

$validOrigin = false;

foreach ($allowedDomains as $domain) {
    if (
        (!empty($origin) && str_starts_with($origin, $domain)) ||
        (!empty($referer) && str_starts_with($referer, $domain))
    ) {
        $validOrigin = true;
        break;
    }
}

if (!$validOrigin) {
    http_response_code(403);
    exit;
}

/*
|--------------------------------------------------------------------------
| Rate limit по IP (1 запрос / 30 сек)
|--------------------------------------------------------------------------
*/
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

$rateLimitDir = sys_get_temp_dir() . '/green-crown-rate-limit';

if (!is_dir($rateLimitDir)) {
    mkdir($rateLimitDir, 0777, true);
}

$rateLimitFile = $rateLimitDir . '/' . md5($ip);

if (file_exists($rateLimitFile)) {

    $lastRequest = (int) file_get_contents($rateLimitFile);

    if ((time() - $lastRequest) < 30) {
        http_response_code(429);
        exit;
    }
}

file_put_contents($rateLimitFile, time());

/*
|--------------------------------------------------------------------------
| Очистка старых rate limit файлов
|--------------------------------------------------------------------------
*/
foreach (glob($rateLimitDir . '/*') as $file) {
    if (filemtime($file) < time() - 3600) {
        unlink($file);
    }
}

/*
|--------------------------------------------------------------------------
| Получение данных формы
|--------------------------------------------------------------------------
*/
$formName = isset($_POST['FormName'])
    ? trim($_POST['FormName'])
    : 'Без имени';

$formPhone = trim($_POST['FormPhone'] ?? '');
$formWp    = trim($_POST['FormWp'] ?? '');
$formTg    = trim($_POST['FormTg'] ?? '');

/*
|--------------------------------------------------------------------------
| Очистка телефонов / WhatsApp
|--------------------------------------------------------------------------
*/
if (!empty($formPhone)) {
    $formPhone = preg_replace('/[^0-9+\-\(\)\s]/', '', $formPhone);
}

if (!empty($formWp)) {
    $formWp = preg_replace('/[^0-9+\-\(\)\s]/', '', $formWp);
}

/*
|--------------------------------------------------------------------------
| Проверка Telegram
|--------------------------------------------------------------------------
*/
if (!empty($formTg)) {
    if (!preg_match('/^@?[a-zA-Z0-9_]{4,32}$/', $formTg)) {
        http_response_code(403);
        exit;
    }
}

/*
|--------------------------------------------------------------------------
| Проверка: только один способ связи
|--------------------------------------------------------------------------
*/
$filled = 0;

if (!empty($formPhone)) $filled++;
if (!empty($formWp))    $filled++;
if (!empty($formTg))    $filled++;

if ($filled !== 1) {
    http_response_code(403);
    exit;
}

/*
|--------------------------------------------------------------------------
| Формирование письма
|--------------------------------------------------------------------------
*/
$body = "<h3>Заявка с сайта: {$formName}</h3>";

if (!empty($formPhone)) {
    $body .= "<p><strong>Телефон:</strong> {$formPhone}</p>";
}

if (!empty($formWp)) {
    $body .= "<p><strong>WhatsApp:</strong> {$formWp}</p>";
}

if (!empty($formTg)) {
    $body .= "<p><strong>Telegram:</strong> {$formTg}</p>";
}

/*
|--------------------------------------------------------------------------
| Отправка email
|--------------------------------------------------------------------------
*/
$mail = new PHPMailer(true);

try {

    $mail->CharSet = 'UTF-8';
    $mail->isSMTP();

    $mail->Host = 'smtp.timeweb.ru';
    $mail->SMTPAuth = true;

    $mail->Username = 'zakaz@green-crown.ru';
    $mail->Password = $config['smtp_password'];

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    $mail->setFrom(
        'zakaz@green-crown.ru',
        'GREENCROWN заявка'
    );

    $mail->addAddress(
        // 'info@green-crown.ru',
        'ksv.ulru@gmail.com',
        'Получатель'
    );

    $mail->isHTML(true);

    $mail->Subject = 'GREENCROWN — новая заявка';

    $mail->Body = $body;
    $mail->AltBody = strip_tags($body);

    $mail->send();

    header('Location: /zayavka-otpravlena/');
    exit;

} catch (Exception $e) {
    http_response_code(500);
    exit;
}