<?php
include("connection1.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $class = $conn->real_escape_string($_POST['class']);
    $subject = $conn->real_escape_string($_POST['subject']);
    $topic = $conn->real_escape_string($_POST['topic']);
    $notes = $conn->real_escape_string($_POST['notes']);
    $teacherCode = $conn->real_escape_string($_POST['code']);
    $feedBack = [];

    $sqlCheck = "SELECT * FROM `notes` WHERE `class`= '$class' AND `subject` = '$subject' AND `topic` = '$topic' AND `teacherCode` = '$teacherCode' ";
    $result = $conn->query($sqlCheck);
    if($result){
        $countNotes = mysqli_num_rows($result);
        if($countNotes > 0){
          $sqlUpdate = "UPDATE `notes` SET `paragraph`='$notes',`class`='$class',`subject`='$subject',`teacherCode`='$teacherCode',`topic`='$topic' WHERE `class`= '$class' AND `subject` = '$subject' AND `topic` = '$topic' AND `teacherCode` = '$teacherCode'";
          if($conn->query($sqlUpdate) === TRUE){
            $feedBack = [
                "message" => "updated succesfully",
                "type" => true
            ];
          }else{
            $feedBack = [
                "message" => "updated failed",
                "type" => false
            ];
          }
        }else{
            $sqlInsert = "INSERT INTO `notes`( `paragraph`, `class`, `subject`, `teacherCode`, `topic`) VALUES ('$notes','$class','$subject','$teacherCode','$topic')";
            if($conn->query($sqlInsert) === TRUE){
                $feedBack = [
                    "message" => "insertion succesfully",
                    "type" => true
                ];
            }else{
                $feedBack = [
                    "message" => "insertion failed",
                    "type" => false
                ];
            }
        }
        echo json_encode($feedBack);
    }else{
        $feedBack = [
            "message" => "no result",
            "error" => $conn->error,
            "type" => false
        ];
        echo json_encode($feedBack);
    }
}
?>