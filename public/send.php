<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'libs/PHPMailer/src/Exception.php';
require 'libs/PHPMailer/src/PHPMailer.php';
require 'libs/PHPMailer/src/SMTP.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получаем данные из формы
    $formName = isset($_POST['FormName']) ? htmlspecialchars(trim($_POST['FormName'])) : 'Без имени';
    $formPhone = isset($_POST['FormPhone']) ? htmlspecialchars(trim($_POST['FormPhone'])) : '';
    $formWp = isset($_POST['FormWp']) ? htmlspecialchars(trim($_POST['FormWp'])) : '';
    $formTg = isset($_POST['FormTg']) ? htmlspecialchars(trim($_POST['FormTg'])) : '';

    // Создаем тело письма
    $body = "<h3>Заявка с формы: {$formName}</h3>";

    // Добавляем телефон, если он не пустой
    if (!empty($formPhone)) {
        $body .= "<p><strong>Телефон:</strong> {$formPhone}</p>";
    }

    // Добавляем WhatsApp, если он не пустой
    if (!empty($formWp)) {
        $body .= "<p><strong>WhatsApp:</strong> {$formWp}</p>";
    }

    // Добавляем Telegram, если он не пустой
    if (!empty($formTg)) {
        $body .= "<p><strong>Telegram:</strong> {$formTg}</p>";
    }

    $mail = new PHPMailer(true);

    try {
        // Настройки PHPMailer
        $mail->CharSet = 'UTF-8';
        $mail->isSMTP();
        $mail->Host = 'smtp.timeweb.ru'; // SMTP-сервер Timeweb
        $mail->SMTPAuth = true;
        $mail->Username = 'zakaz@green-crown.ru'; // Логин для SMTP
        $mail->Password = 'Oik24I62J'; // Пароль для SMTP
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Используем SSL (для порта 465)
        $mail->Port = 465; // Порт для SSL

        // Отправка письма
        $mail->setFrom('zakaz@green-crown.ru', 'GREENCROWN заявка');
        $mail->addAddress('ksv.ulru@gmail.com', 'Получатель'); // Адрес получателя

        // Настройки письма
        $mail->isHTML(true);
        $mail->Subject = 'GREENCROWN - заявка';
        $mail->Body = $body;
        $mail->AltBody = strip_tags($body); // Текстовое тело для клиентов, не поддерживающих HTML

        // Отправка письма
        $mail->send();

        // Перенаправление на страницу благодарности
        header('Location: zayavka-otpravlena/');
        exit;
    } catch (Exception $e) {
        echo "Ошибка отправки: {$mail->ErrorInfo}";
    }
} else {
    echo 'Доступ запрещен';
}
?>