<?php
include("connection.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $aboutMe = $conn->real_escape_string($_POST['aboutMe']);
    $code = $conn->real_escape_string($_POST['code']);

    $sqlUpdate = "UPDATE `teachers` SET `aboutMe` = '$aboutMe' WHERE `teachers_code` = '$code'";
    if($conn->query($sqlUpdate) === TRUE){
        $feedback = [
            "message" => "success",
            "type" => true
        ];
    }else{
        $feedback = [
            "message" => "error saving",
            "type" => false,
            "errorInfo" => $conn->error
        ];
    }

    echo json_encode($feedback);
}
?>