<?php
 include("connection1.php");
 if($_SERVER['REQUEST_METHOD'] === 'POST'){

    $codes = $_POST['code'];

  foreach($codes as $index => $code){
    $topic = $conn->real_escape_string($_POST['topic']);
    $code = $conn->real_escape_string($codes[$index]);
    $type = $conn->real_escape_string($_POST['type']);

    $sqlCheck = "SELECT * FROM `school_quiz` WHERE `Quiz_code` = '$code'";
    $result = $conn->query($sqlCheck);
    if(!$result){
        $feedback = [
            "message" => "error failed".$conn->error,
            "type" => false
        ];
    }
    $count_quiz = mysqli_num_rows($result);

    if($count_quiz > 0){
        if(!empty($type)){
            $sqlUpdate = "UPDATE `school_quiz` SET `type`='$type', `topic_heading`='$topic' WHERE `Quiz_code` = '$code'";

            if($conn->query($sqlUpdate) === TRUE){
            $feedback = [
                "message" => "update successx",
                "type" => true
                ];
            }else{
            $feedback = [
                "message" => "Error in posting questions".$conn->error,
                "type" => false
                ];
            }
        }else{
            $sqlUpdate = "UPDATE `school_quiz` SET `topic_heading`='$topic' WHERE `Quiz_code` = '$code'";

            if($conn->query($sqlUpdate) === TRUE){
            $feedback = [
                "message" => "update successz",
                "topic" => $topic,
                "type" => true
                ];
            }else{
            $feedback = [
                "message" => "Error in posting questions".$conn->error,
                "type" => false
                ];
            }
        }
            echo json_encode($feedback);
    }else{
        echo json_encode([
           "message" => "error loading quiz details",
           "code" => $code[0],
           "type" => false
        ]);
    }

  }
 }
?>