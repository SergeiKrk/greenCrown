<?php

session_start();

header('Content-Type: application/json');

if (
    empty($_SESSION['csrf_token']) ||
    empty($_SESSION['csrf_token_time']) ||
    time() - $_SESSION['csrf_token_time'] > 3600
) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    $_SESSION['csrf_token_time'] = time();
}

echo json_encode([
    'csrf_token' => $_SESSION['csrf_token']
]);