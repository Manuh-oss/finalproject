<?php
include("connection1.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
  $subject = $conn->real_escape_string($_POST['subject']);
  $class = $conn->real_escape_string($_POST['class']);

  if(!empty($subject) && !empty($class)){
    $sql = "SELECT * FROM `school_quiz` WHERE `subjects` = '$subject' AND `class` = '$class' ORDER BY `quizDate` DESC";
    $result = $conn->query($sql);
  
    $feedback = [];
  
    while($row = $result->fetch_assoc()){
       $feedback [] = [
          "question" => $row['question'],
          "answers"  => [
              $row['answer1'],
              $row['answer2'],
              $row['answer3'],
              $row['answer4']
          ],
          "correct" =>  $row['correct_answer'],
          "solution" => $row['solution'],
          "quizCode" => $row['Quiz_code'],
          "topic" => $row['topic_heading'],
          "teacherCode" => $row['teacher_code'],
          "duration" => $row['quiz_duration'],
          "subject" => $row['subjects'],
          "type" => $row['type'],
          "class" => $row['class']
      ];
    }
  
    echo json_encode($feedback);
  }else{
    $sql = "SELECT * FROM `school_quiz`";
    $result = $conn->query($sql);
  
    $feedback = [];
  
    while($row = $result->fetch_assoc()){
       $feedback [] = [
          "question" => $row['question'],
          "answers"  => [
              $row['answer1'],
              $row['answer2'],
              $row['answer3'],
              $row['answer4']
          ],
          "correct" =>   $row['correct_answer'],
          "solution" => $row['solution'],
          "quizCode" => $row['Quiz_code'],
          "topic" => $row['topic_heading'],
          "teacherCode" => $row['teacher_code'],
          "duration" => $row['quiz_duration'],
          "class" => $row['class'],
          "type" => $row['type'],
          "subject" => $row['subjects']
      ];
    }
  
    echo json_encode($feedback);
  }

}
$conn->close();
?>