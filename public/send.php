<?php

declare(strict_types=1);

ini_set('display_errors', '0');
error_reporting(0);

session_start();

$config = require __DIR__ . '/private/config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/libs/PHPMailer/src/Exception.php';
require __DIR__ . '/libs/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/libs/PHPMailer/src/SMTP.php';

/*
|--------------------------------------------------------------------------
| Проверка SmartCaptcha
|--------------------------------------------------------------------------
*/
function checkCaptcha(
    string $token,
    string $serverKey
): bool {

    if (empty($token)) {
        return false;
    }

    $url = 'https://smartcaptcha.yandexcloud.net/validate';

    // Не пробрасываем REMOTE_ADDR напрямую: при наличии CDN/прокси это
    // будет IP фронта, а не клиента, и яндекс отклонит токен.
    $clientIp = '';

    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $forwarded = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $clientIp  = trim($forwarded[0]);
    } elseif (!empty($_SERVER['HTTP_X_REAL_IP'])) {
        $clientIp = trim($_SERVER['HTTP_X_REAL_IP']);
    }

    $data = [
        'secret' => $serverKey,
        'token'  => $token
    ];

    if (!empty($clientIp) && filter_var($clientIp, FILTER_VALIDATE_IP)) {
        $data['ip'] = $clientIp;
    }

    $options = [
        'http' => [
            'header' =>
                "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data),
            'timeout' => 3,
            'ignore_errors' => true
        ]
    ];

    $context = stream_context_create($options);

    $result = @file_get_contents(
        $url,
        false,
        $context
    );

    if ($result === false) {
        return false;
    }

    $response = json_decode($result, true);

    return isset($response['status'])
        && $response['status'] === 'ok';
}

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
| Проверка User-Agent
|--------------------------------------------------------------------------
*/
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

if (
    empty($userAgent) ||
    strlen($userAgent) < 20
) {
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
    (int) $_SERVER['CONTENT_LENGTH'] > 10000
) {
    http_response_code(413);
    exit;
}

/*
|--------------------------------------------------------------------------
| Honeypot
|--------------------------------------------------------------------------
*/
if (!empty($_POST['website'])) {
    http_response_code(403);
    exit;
}

/*
|--------------------------------------------------------------------------
| Проверка времени заполнения формы
|--------------------------------------------------------------------------
*/
if (!isset($_POST['form_time'])) {
    http_response_code(403);
    exit;
}

$formTime = (int) $_POST['form_time'];

$currentTime = (int) round(microtime(true) * 1000);

$elapsed = $currentTime - $formTime;

if ($elapsed < 1500 || $elapsed > 86400000) {
    http_response_code(403);
    exit;
}

/*
|--------------------------------------------------------------------------
| Проверка SmartCaptcha
|--------------------------------------------------------------------------
*/
$captchaToken = $_POST['smart-token'] ?? '';

if (
    !checkCaptcha(
        $captchaToken,
        $config['smartcaptcha_server_key']
    )
) {
    http_response_code(403);
    exit;
}

/*
|--------------------------------------------------------------------------
| Проверка origin / referer
|--------------------------------------------------------------------------
*/
$allowedDomains = [
    'https://green-crown.ru',
    'https://www.green-crown.ru'
];

$origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';

$validOrigin = false;

foreach ($allowedDomains as $domain) {

    if (
        (!empty($origin) &&
            str_starts_with($origin, $domain))
        ||
        (!empty($referer) &&
            str_starts_with($referer, $domain))
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
| Rate limit по IP
|--------------------------------------------------------------------------
*/
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

$rateLimitDir =
    sys_get_temp_dir() .
    '/green-crown-rate-limit';

if (!is_dir($rateLimitDir)) {
    mkdir($rateLimitDir, 0777, true);
}

$rateLimitFile =
    $rateLimitDir .
    '/' .
    md5($ip);

if (file_exists($rateLimitFile)) {

    $lastRequest =
        (int) file_get_contents($rateLimitFile);

    if ((time() - $lastRequest) < 10) {
        http_response_code(429);
        exit;
    }
}

// Отметка в rate-limit файл будет сделана ТОЛЬКО при успешной
// отправке письма (см. ниже в try/catch). Иначе любой неудачный
// проход блокирует легитимный ретрай на 30 секунд.

/*
|--------------------------------------------------------------------------
| Очистка старых файлов
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
    ? mb_substr(trim($_POST['FormName']), 0, 200)
    : 'Без имени';

$formPhone = mb_substr(trim($_POST['FormPhone'] ?? ''), 0, 30);
$formWp    = mb_substr(trim($_POST['FormWp']    ?? ''), 0, 30);
$formTg    = mb_substr(trim($_POST['FormTg']    ?? ''), 0, 40);

/*
|--------------------------------------------------------------------------
| Очистка телефонов
|--------------------------------------------------------------------------
*/
if (!empty($formPhone)) {
    $formPhone = preg_replace(
        '/[^0-9+\-\(\)\s]/',
        '',
        $formPhone
    );
}

if (!empty($formWp)) {
    $formWp = preg_replace(
        '/[^0-9+\-\(\)\s]/',
        '',
        $formWp
    );
}

/*
|--------------------------------------------------------------------------
| Проверка Telegram
|--------------------------------------------------------------------------
*/
if (!empty($formTg)) {

    if (
        !preg_match(
            '/^@?[a-zA-Z0-9_]{4,32}$/',
            $formTg
        )
    ) {
        http_response_code(403);
        exit;
    }
}

/*
|--------------------------------------------------------------------------
| Только один способ связи
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
$safeName  = htmlspecialchars($formName,  ENT_QUOTES | ENT_HTML5, 'UTF-8');
$safePhone = htmlspecialchars($formPhone, ENT_QUOTES | ENT_HTML5, 'UTF-8');
$safeWp    = htmlspecialchars($formWp,    ENT_QUOTES | ENT_HTML5, 'UTF-8');
$safeTg    = htmlspecialchars($formTg,    ENT_QUOTES | ENT_HTML5, 'UTF-8');

$body =
    "<h3>Заявка с сайта: {$safeName}</h3>";

if (!empty($formPhone)) {
    $body .=
        "<p><strong>Телефон:</strong> {$safePhone}</p>";
}

if (!empty($formWp)) {
    $body .=
        "<p><strong>WhatsApp:</strong> {$safeWp}</p>";
}

if (!empty($formTg)) {
    $body .=
        "<p><strong>Telegram:</strong> {$safeTg}</p>";
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

    $mail->Username =
        'zakaz@green-crown.ru';

    $mail->Password =
        $config['smtp_password'];

    $mail->SMTPSecure =
        PHPMailer::ENCRYPTION_SMTPS;

    $mail->Port = 465;

    $mail->setFrom(
        'zakaz@green-crown.ru',
        'GREENCROWN заявка'
    );

    $mail->addAddress(
        'ksv.ulru@gmail.com',
        // 'info@green-crown.ru',
        'Получатель'
    );

    $mail->isHTML(true);

    $mail->Subject =
        'GREENCROWN — новая заявка';

    $mail->Body = $body;

    $mail->AltBody =
        strip_tags($body);

    $mail->send();

    // Фиксируем время только после реально успешной отправки,
    // чтобы ретраи после ошибок не получали 429.
    @file_put_contents(
        $rateLimitFile,
        (string) time()
    );

    unset($_SESSION['csrf_token']);

    header('Location: /zayavka-otpravlena/');

    exit;

} catch (Exception $e) {

    http_response_code(500);

    exit;
}