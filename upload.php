<?php
include("connection2.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
   $marks = $_POST['marks'];
   $admissions = $_POST['admissions'];
   $subject = $conn->real_escape_string($_POST['subject']);
   $class = $conn->real_escape_string($_POST['class']);
   $term = $conn->real_escape_string($_POST['term']);
   $stream = $conn->real_escape_string($_POST['stream']);
   $exam = $conn->real_escape_string($_POST['exam']);
   $id = $conn->real_escape_string($_POST['id']);
   $errors = null; 

   for($i = 0; $i < count($admissions) ; $i++){
    $admission = $conn->real_escape_string($admissions[$i]);
    $mark = $conn->real_escape_string($marks[$i]);
    
    $sqlUpdate = "UPDATE `studentdetails` SET `$subject`='$mark' WHERE`admission`='$admission'AND`class`='$class'AND`stream`='$stream'AND`term`='$term'AND`exam`='$exam'AND`school_id`='$id'";

    if($conn->query($sqlUpdate) !== TRUE){
        $errors = [
            "message" => "error uploading".$admission."marks",
            "type" => false,
            "errorInfo" => $conn->error
        ];
        break;
    }

   }

    header('Content-Type: application/json'); 
   
    if($errors){
        echo json_encode($errors);
    }else{
        echo json_encode([
            "message" => "success",
            "type" => true
        ]);
    }

}else{
    header("location:marks2.html");
    exit();
}
$conn->close();
?>