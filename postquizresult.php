<?php
include("connection1.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
   $addmision = $conn->real_escape_string($_POST['admission']);
   $quizCode = $conn->real_escape_string($_POST['code']);
   $attemptDate = $conn->real_escape_string($_POST['date']);
   $score = $conn->real_escape_string($_POST['score']);
   $topicNumber = $conn->real_escape_string($_POST['topic']);
   $attempt = $conn->real_escape_string($_POST['attempt']);

   $sqlCheck = "SELECT * FROM `student_quiz_result` WHERE `score` = '$score' AND `quizCode` = '$quizCode' AND `admission` = '$addmision' AND `attemptDate` = '$attemptDate'";
   
   $resultCheck = $conn->query($sqlCheck);
   $count_attempts = mysqli_num_rows($resultCheck);

   $feedback = [];


    $sqlInsert = "INSERT INTO `student_quiz_result`(`score`, `admission`, `attempt`, `quizCode`, `topic`, `attemptDate`) VALUES ('$score','$addmision','$attempt','$quizCode','$topicNumber','$attemptDate')";

    if($conn->query($sqlInsert) === TRUE){
        $feedback[] = [
            "message" => "success",
            "type" => true
           ];
    }else{
        $feedback[] = [
            "message" => "error in uploading marks".$conn->error,
            "type" => false
           ];
    }

   echo json_encode($feedback);
   
}
$conn->close();
?>