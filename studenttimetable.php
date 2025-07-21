<?php
include("connection.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){

    $class = $conn->real_escape_string($_POST['student-class']);
    $stream = $conn->real_escape_string($_POST['student-stream']);
    
    $sql = "SELECT * FROM `school_timetable` WHERE `class` = '$class' AND `stream` = '$stream'";
        
    $result = $conn->query($sql);
    $feedback = [];
    if(!$result){
      $feedback[] = [
         "mesaage" => "error",
         "sql" => "SQl",
         "error" => $conn->error
      ];
      echo json_encode($feedback);
    }else{
        while($row = $result->fetch_assoc()){
           $feedback [] = [
             "class" => $row['class'],
             "stream" => $row['stream'],
             "lesson1" => $row['lesson_one'],
             "lesson2" => $row['lesson_two'],
             "lesson3" => $row['lesson_three'],
             "lesson4" => $row['lesson_four'],
             "lesson5" => $row['lesson_five'],
             "lesson6" => $row['lesson_six'],
             "lesson7" => $row['lesson_seven'],
             "lesson8" => $row['lesson_eight'],
             "lesson9" => $row['lesson_nine'],
             "lesson10" => $row['lesson_ten'],
             "day" => $row['day']
           ];
        }
        echo json_encode($feedback);
    }
}
$conn->close();
?>