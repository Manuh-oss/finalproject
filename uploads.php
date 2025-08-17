<?php
include("connection2.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $subjectArray = $_POST['subject-array'];
    $classArray = $_POST['class-array'];
    $streamArray = $_POST['stream-array'];
    $layoutArray = $_POST['layout-array'];
    $feedback = "";

    if(isset($subjectArray) && empty($layoutArray)){
        $subject = $conn->real_escape_string($subjectArray);
        $class = $conn->real_escape_string($classArray);
        $stream = $conn->real_escape_string($streamArray);
        $layout = $conn->real_escape_string($layoutArray);
        $sqlUpdate = "UPDATE `school-information` SET `subjects` = '$subject',`class`='$class',`streams`='$stream'";

        if($conn->query($sqlUpdate) === TRUE){
            $feedback = [
                "message" => "subjects updated",
                "type" => true
            ];
        }else{
            $feedback = [
                "message" => "error",
                "errorInfo" => $conn->error,
                "type" => flase
            ];
        }
        echo json_encode($feedback);
    }else{
        $sqlUpdate = "UPDATE `school-information` SET `layout` = '$layoutArray'";
         if($conn->query($sqlUpdate) === TRUE){
            $feedback = [
                "message" => "layout updated",
                "type" => true
            ];
        }else{
            $feedback = [
                "message" => "error",
                "errorInfo" => $conn->error,
                "type" => flase
            ];
        }
        echo json_encode($feedback);
    }

}

?>
