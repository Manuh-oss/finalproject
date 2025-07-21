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
   $allFeedback = [];

   for($i = 0; $i < count($admissions) ; $i++){
    $admission = $conn->real_escape_string($admissions[$i]);
    $mark = $conn->real_escape_string($marks[$i]);
    
    $sqlUpdate = "UPDATE `studentdetails` SET `$subject`='$mark' WHERE`admission`='$admission'AND`class`='$class'AND`stream`='$stream'AND`term`='$term'AND`exam`='$exam'";

    if($conn->query($sqlUpdate) === TRUE){
        $feedback = [
            "message" => "sucess",
            "type" => true,
        ];
    }else{
          $feedback = [
            "message" => "error",
            "errorInto" => $conn->error,
            "type" => true
        ];
    }

     $allFeedback[] = $feedback;

   }

    header('Content-Type: application/json'); // Important: Tell the client it's JSON
    echo json_encode($allFeedback);

}else{
    header("location:marks2.html");
    exit();
}
$conn->close();
?>