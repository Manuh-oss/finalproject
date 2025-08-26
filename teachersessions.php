<?php
include("connection.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $id = $conn->real_escape_string($_POST['id']);
    $code = $conn->real_escape_string($_POST['teacherCode']);
    $feedBack = [];
    
    if(!empty($id) && !empty($code)){
    $sqlGet = "SELECT * FROM `teachers_timetable` WHERE `school_id` = '$id' AND `teacher_code`='$code'";
    $result = $conn->query($sqlGet);
    if($result){

        $countSessions = mysqli_num_rows($result);
        if($countSessions > 0){
            while($row = $result->fetch_assoc()){
                $feedBack [] = [
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
                    "schoolId" => $row['school_id']
                ];
            }
             echo json_encode($feedBack);
        }else{
           echo json_encode([]);
        }

    }else{
      echo json_encode([
        "message" => "no result found",
        "type" => false,
        "errorInfo" => $conn->error
      ]);
    }
    }else{
      $sqlGet = "SELECT * FROM `teachers_timetable`"; 
      $result = $conn->query($sqlGet);
    if($result){

        $countSessions = mysqli_num_rows($result);
        if($countSessions > 0){
            while($row = $result->fetch_assoc()){
                $feedBack [] = [
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
                    "schoolId" => $row['school_id']
                ];
            }
             echo json_encode($feedBack);
        }else{
           echo json_encode([]);
        }

    }else{
      echo json_encode([
        "message" => "no result found",
        "type" => false,
        "errorInfo" => $conn->error
      ]);
    } 
    }
}
?>