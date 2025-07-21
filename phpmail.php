<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Generate OTP
$otp = rand(100000, 999999);
$to = "emmanuelmwendwa185@gmail.com"; // Replace with real email

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();                                      
    $mail->Host       = 'smtp.gmail.com';                 
    $mail->SMTPAuth   = true;                             
    $mail->Username   = 'emmanuelmwendwa213@gmail.com';   // Use your Gmail
    $mail->Password   = 'vteq voxy dbob ybhr';     // App password, not Gmail password
    $mail->SMTPSecure = 'tls';                           
    $mail->Port       = 587;                             

    // Recipients
    $mail->setFrom('your_email@gmail.com', 'Your Name');
    $mail->addAddress($to);

    // Content
    $mail->isHTML(true);                                  
    $mail->Subject = 'Your OTP Code';
    $mail->Body    = "Your One-Time Password is: <b>$otp</b>";

    $mail->send();
    echo 'OTP has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>
