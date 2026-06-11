<?php

declare(strict_types=1);

ini_set('display_errors', '0');
error_reporting(0);

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
        $GLOBALS['_captcha_debug'] = 'empty_token';
        return false;
    }

    $url = 'https://smartcaptcha.yandexcloud.net/validate';

    $data = [
        'secret' => $serverKey,
        'token'  => $token
    ];

    // Используем cURL (работает даже когда allow_url_fopen отключен)
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($data),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 5,
            CURLOPT_CONNECTTIMEOUT => 3,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
        ]);
        $result = curl_exec($ch);
        $curlError = curl_error($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($result === false) {
            $GLOBALS['_captcha_debug'] = 'curl_err:' . $curlError;
            return false;
        }
        if ($httpCode !== 200) {
            $GLOBALS['_captcha_debug'] = 'http' . $httpCode . ':' . mb_substr($result, 0, 100);
            return false;
        }
    } else {
        // Fallback: file_get_contents
        $options = [
            'http' => [
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'POST',
                'content' => http_build_query($data),
                'timeout' => 5,
                'ignore_errors' => true
            ]
        ];

        $context = stream_context_create($options);
        $result = @file_get_contents($url, false, $context);

        if ($result === false) {
            $GLOBALS['_captcha_debug'] = 'fgc_failed';
            return false;
        }
    }

    $response = json_decode($result, true);

    if (!isset($response['status']) || $response['status'] !== 'ok') {
        $GLOBALS['_captcha_debug'] = 'resp:' . mb_substr($result, 0, 150);
        return false;
    }

    return true;
}

/*
|--------------------------------------------------------------------------
| Только POST
|--------------------------------------------------------------------------
*/
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    echo 'E01:METHOD';
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
    echo 'E02:UA';
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
    echo 'E03:HONEYPOT';
    exit;
}

/*
|--------------------------------------------------------------------------
| Проверка времени заполнения формы
|--------------------------------------------------------------------------
| form_time = client Date.now() (ms). Сравниваем с серверным временем.
| Допускаем расхождение часов клиента и сервера до 60 секунд.
*/
if (!isset($_POST['form_time'])) {
    http_response_code(403);
    echo 'E04:NO_TIME';
    exit;
}

$formTime = (int) $_POST['form_time'];

$currentTime = (int) round(microtime(true) * 1000);

$elapsed = $currentTime - $formTime;

// Минимум 1.5 сек (защита от бота), но допускаем отрицательное
// смещение до -60 сек (clock skew). Максимум 24 часа.
if ($elapsed < -60000 || $elapsed > 86400000) {
    http_response_code(403);
    echo 'E05:TIME:' . $elapsed;
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
    echo 'E06:CAPTCHA:' . ($GLOBALS['_captcha_debug'] ?? 'no_debug');
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
    echo 'E07:ORIGIN:' . $origin . '|' . $referer;
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

$formContact = mb_substr(trim($_POST['FormContact'] ?? ''), 0, 100);
$formMethod  = mb_substr(trim($_POST['FormMethod']  ?? ''), 0, 20);

/*
|--------------------------------------------------------------------------
| Очистка телефонов
|--------------------------------------------------------------------------
*/
if ($formMethod === 'phone' || $formMethod === 'whatsapp') {
    $formContact = preg_replace(
        '/[^0-9+\-()\s]/',
        '',
        $formContact
    );
}

/*
|--------------------------------------------------------------------------
| Проверка Telegram
|--------------------------------------------------------------------------
*/
if ($formMethod === 'telegram') {
    if (
        !preg_match(
            '/^@?[a-zA-Z0-9_]{4,32}$/',
            $formContact
        )
    ) {
        http_response_code(403);
        echo 'E08:TG_FORMAT';
        exit;
    }
}

/*
|--------------------------------------------------------------------------
| Проверка контакта и метода
|--------------------------------------------------------------------------
*/
if (empty($formContact)) {
    http_response_code(403);
    echo 'E09:EMPTY_CONTACT';
    exit;
}

// Validate method value
$allowedMethods = ['phone', 'whatsapp', 'telegram'];
if (!in_array($formMethod, $allowedMethods, true)) {
    http_response_code(403);
    echo 'E10:BAD_METHOD:' . $formMethod;
    exit;
}

/*
|--------------------------------------------------------------------------
| Формирование письма
|--------------------------------------------------------------------------
*/
$safeContact = htmlspecialchars($formContact, ENT_QUOTES | ENT_HTML5, 'UTF-8');
$safeMethod  = htmlspecialchars($formMethod,  ENT_QUOTES | ENT_HTML5, 'UTF-8');
$safeName    = htmlspecialchars($formName,    ENT_QUOTES | ENT_HTML5, 'UTF-8');

$methodLabels = [
    'phone'    => 'Телефон',
    'whatsapp' => 'WhatsApp',
    'telegram' => 'Telegram'
];

$methodLabel = $methodLabels[$formMethod] ?? $safeMethod;

$body = "<h3>Заявка с сайта: {$safeName}</h3>";
$body .= "<p><strong>{$methodLabel}:</strong> {$safeContact}</p>";

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
        // 'ksv.ulru@gmail.com',
        'info@green-crown.ru',
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

    header('Location: /zayavka-otpravlena/');

    exit;

} catch (Exception $e) {

    http_response_code(500);

    exit;
}