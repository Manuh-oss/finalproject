<?php
include("connection.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
   $tcode = $conn->real_escape_string($_POST['code']);
   $id = $conn->real_escape_string($_POST['id']);

   $sqlDelete = "DELETE FROM `teachers_subjects_taught` WHERE `teacher_code` = '$tcode'AND`school_id`='$id'";
   if($conn->query($sqlDelete) === TRUE){
     $feedback = [
        "message" => "delete success",
        "type" => true,
     ];
     echo json_encode($feedback);
   }else{
     $feedback = [
        "message" => "contact support",
        "type" => false,
        "errroInfo" => $conn->error
     ];
     echo json_encode($feedback);
   }
}
?>