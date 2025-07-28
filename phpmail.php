<?php
session_start();
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

$mail = new PHPMailer(true);
$otp = rand(100000, 999999);
$userEmail = $_SESSION['email'];
$name = $_SESSION['name'];

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'emmanuelmwendwa213@gmail.com';
    $mail->Password   = 'yoscbzcnhmtcicwj';
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    // Recipients
    $mail->setFrom('emmanuelmwendwa213@gmail.com', 'finewave technologies');
    $mail->addAddress($userEmail, $name);

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Your OTP Code';
    $mail->Body    = "<h3>Your OTP code is <strong>$otp</strong></h3>";
    $mail->AltBody = "Your OTP code is $otp";

    $mail->send();
    $_SESSION['otp'] = $otp;
    echo json_encode([
      "message" => "otp sent sucessfully",
      "type" => true
    ]);
} catch (Exception $e) {
    echo json_encode([
        "message" => "error sending otp",
        "type" => false,
        "errorInfo" => $mail->errorInfo
    ]);
}

