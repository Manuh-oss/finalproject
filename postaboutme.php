<?php
include("connection.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $aboutMe = $conn->real_escape_string($_POST['aboutMe']);
    $code = $conn->real_escape_string($_POST['code']);
    $id = $conn->real_escape_string($_POST['id']);

    $sqlUpdate = "UPDATE `teachers` SET `aboutMe` = '$aboutMe' WHERE `teachers_code` = '$code'AND`school_id`='$id'";
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