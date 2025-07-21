<?php
include("connection1.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
   $questions = ($_POST['questions']);
   $answerOnes = ($_POST['answerOne']);
   $answerTwos = ($_POST['answerTwo']);
   $answerThrees = ($_POST['answerThree']);
   $answerFours = ($_POST['answerFour']);
   $corrects = ($_POST['answerFour']);
   $solutions = ($_POST['solutions']);

   $streams = ($_POST['stream']);
   $teacherCodes = ($_POST['tcode']);
   $quizCodes = $_POST['quiz-code'];
   
   $feedback = "";

   foreach($questions as $index => $question){
    $question = $conn->real_escape_string($questions[$index]);
    $answerOne = $conn->real_escape_string($answerOnes[$index]);
    $answerTwo = $conn->real_escape_string($answerTwos[$index]);
    $answerThree = $conn->real_escape_string($answerThrees[$index]);
    $answerFour = $conn->real_escape_string($answerFours[$index]);
    $correct = $conn->real_escape_string($corrects[$index]);
    $solution = $conn->real_escape_string($solutions[$index]);
    
    $class = $conn->real_escape_string($_POST['class']);
    $teacherCode = $conn->real_escape_string($_POST['tcode']);
    $subject = $conn->real_escape_string($_POST['subject']);
    $topic = $conn->real_escape_string($_POST['topics']);
    $type = $conn->real_escape_string($_POST['type']);
    $duration = $conn->real_escape_string($_POST['duration']);
    $quizCode = $conn->real_escape_string($quizCodes[$index]);

    $sqlCheck = "SELECT * FROM `school_quiz` WHERE `question` = '$question' AND `teacher_code` =  '$teacherCode' ";
    $result = $conn->query($sqlCheck);
    if(!$result){
        $feedback = [
            "message" => "error failed".$conn->error,
            "type" => false
        ];
    }
    $count_quiz = mysqli_num_rows($result);

   if($count_quiz > 0){
        $sqlUpdate = "UPDATE `school_quiz` SET `question`='$question',`answer1`='$answerOne',`answer2`='$answerTwo',`answer3`='$answerThree',`answer4`='$answerFour',`correct_answer`='$correct',`solution`='$solution',`subjects`='$subject',`topic_heading`='$topic',`Quiz_code`='$quizCode',`quiz_duration`='$duration',`teacher_code`='$teacherCode',`class`='$class' WHERE 
        `teacher_code` = '$teacherCode' AND `question` = '$question' AND `correct_answer` = '$correct'";

        if($conn->query($sqlUpdate) === TRUE){
            $feedback = [
                "message" => "update success",
                "type" => true
            ];
        }else{
            $feedback = [
                "message" => "Error in posting questions".$conn->error,
                "type" => false
            ];
        }
    }else{
        $sqlInsert = "INSERT INTO `school_quiz`(`question`, `answer1`, `answer2`, `answer3`, `answer4`, `correct_answer`, `subjects`, `topic_heading`, `Quiz_code`, `quiz_duration`, `teacher_code`,`class`,`solution`,`type`) VALUES ('$question','$answerOne','$answerTwo','$answerThree','$answerFour','$correct','$subject','$topic','$quizCode','$duration','$teacherCode','$class','$solution','$type')";

        if($conn->query($sqlInsert) === TRUE){
           $feedback = [
               "message" => "insertion success",
               "type" => true
           ];
        }else{
           $feedback = [
               "message" => "Error in posting questions",
               "type" => false
           ];
      }
    }
   } 
   echo json_encode($feedback);
}else{
  
        $feedback = [
            "message" => "form was not submitted",
            "type" => false
        ];
        echo json_encode($feedback);

}

$conn->close();
?>