<?php
session_start();
if($_SERVER['REQUEST_METHOD'] === 'POST'){
   $otp = $_SESSION['otp'];
   $userOtp = $_POST['user-otp'];
   
   if($otp == $userOtp){
    echo json_encode([
      "message" => "validated",
      "type" => true
    ]);
   }else{
    echo json_encode([
      "message" => "wrong otp",
      "type" => false,
      "userOtp" => $userOtp,
      "otp" => $otp
    ]);
   }
}
?>