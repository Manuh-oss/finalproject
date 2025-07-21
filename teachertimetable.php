<?php
include("connection.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $teacherCode = $conn->real_escape_string($_POST['teacherCode']);
    $sql = "SELECT teachers_timetable.teacher_code, .teachers_timetable.day, .teachers_timetable.lesson_one, .teachers_timetable.lesson_two, .teachers_timetable.lesson_three, .teachers_timetable.lesson_four, .teachers_timetable.lesson_five, .teachers_timetable.lesson_six, .teachers_timetable.lesson_seven, .teachers_timetable.lesson_eight, .teachers_timetable.lesson_nine, .teachers_timetable.lesson_ten, teachers.firstname, teachers.middlename , teachers.file_path FROM teachers_timetable JOIN teachers ON teachers_timetable.teacher_code = teachers.teachers_code  WHERE teachers.teachers_code = '$teacherCode'";
    
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
            "teacherCode" => $row['teacher_code'],
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
             "day" => $row['day'],
             "firstname" => $row['firstname'],
             "middlename" => $row['middlename'],
             "profileImage" => $row['file_path']
           ];
        }
        echo json_encode($feedback);
    }
}
$conn->close();
?>