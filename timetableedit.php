<?php
include("connection.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $day = $conn->real_escape_string($_POST['day']);
    $lesson = $conn->real_escape_string($_POST['lesson']);
    $value = $conn->real_escape_string($_POST['value']);
    $class = $conn->real_escape_string($_POST['class']);
    $stream = $conn->real_escape_string($_POST['stream']);

    $sqlUpdate = "UPDATE `school_timetable` SET `$lesson` = '$value' WHERE `day`='$day' AND `class`='$class'AND`stream`='$stream'";
    if($conn->query($sqlUpdate) === true){
        $feedBack = [
            "message" => "update success",
            "type" => true,
            "value" => $value
        ];
    }else{
        $feedBack = [
            "message" => "error",
            "type" => false,
            "errorInfo" => $conn->error
        ];
    }
    echo json_encode($feedBack);
}
?>