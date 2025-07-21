<?php
include("connection.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $firstLessons = ($_POST['first']);
    $secondLessons = ($_POST['second']);
    $thirdLessons = ($_POST['third']);
    $forthLessons = ($_POST['forth']);
    $fifthLessons = ($_POST['fifth']);
    $sixthLessons = ($_POST['sixth']);
    $seventhLessons = ($_POST['seventh']);
    $eigthLessons = ($_POST['eigth']);
    $ninthLessons = ($_POST['ninth']);
    $tenthLessons = ($_POST['tenth']);
  
    $days = ["monday" , "tuesday" , "wednesday" , "thursday" ,"friday","saturday","sunday"];
    $teacherCode = $conn->real_escape_string($_POST['teacher-code']);

    foreach($firstLessons as $index => $firstLesson){
        $firstLesson = $conn->real_escape_string($firstLessons[$index]);
        $secondLesson = $conn->real_escape_string($secondLessons[$index]);
        $thirdLesson = $conn->real_escape_string($thirdLessons[$index]);
        $forthLesson = $conn->real_escape_string($forthLessons[$index]);
        $fifthLesson = $conn->real_escape_string($fifthLessons[$index]);
        $sixthLesson = $conn->real_escape_string($sixthLessons[$index]);
        $seventhLesson = $conn->real_escape_string($seventhLessons[$index]);
        $eigthLesson = $conn->real_escape_string($eigthLessons[$index]);
        $ninthLesson = $conn->real_escape_string($ninthLessons[$index]);
        $tenthLesson = $conn->real_escape_string($tenthLessons[$index]);
        $day = $days[$index];
        
        $sqlCheck = "SELECT * FROM `teachers_timetable` WHERE `teacher_code` = '$teacherCode' AND `day` = '$day'";
        $result = $conn->query($sqlCheck);
        $countTimetable = mysqli_num_rows($result);

        if($countTimetable > 0){
          $sqlUpdate =  " UPDATE `teachers_timetable` SET `lesson_one`='$firstLesson',`lesson_two`='$secondLesson',`lesson_three`='$thirdLesson',`lesson_four`='$forthLesson',`lesson_five`='$fifthLesson',`lesson_six`='$sixthLesson',`lesson_seven`='$seventhLesson',`lesson_eight`='$eigthLesson',`lesson_nine`='$ninthLesson',`lesson_ten`='$tenthLesson' WHERE `teacher_code` = '$teacherCode' AND `day` = '$day'";
          if($conn->query($sqlUpdate)=== TRUE){
              $feedback [] = [
                "message" => "success",
                "day" => $day,
                "type" => true
              ];
           }else{
              $feedback [] = [
                "message" => "error".$conn->error,
                "type" => false
              ]; 
          }
        }else{
            $sqlInsert = "INSERT INTO `teachers_timetable`(`teacher_code`, `day`, `lesson_one`, `lesson_two`, `lesson_three`, `lesson_four`, `lesson_five`, `lesson_six`, `lesson_seven`, `lesson_eight`, `lesson_nine`, `lesson_ten`) VALUES ('$teacherCode','$day','$firstLesson','$secondLesson','$thirdLesson','$forthLesson','$fifthLesson','$sixthLesson','$seventhLesson','$eigthLesson','$ninthLesson','$tenthLesson')";
    
            if($conn->query($sqlInsert) === TRUE){
                $feedback [] = [
                    "message" => "success",
                    "type" => true
                ];
            }else{
                $feedback [] = [
                    "message" => "errors".$conn->error,
                    "type" => false
                ]; 
            }
        }
      
      }
    
   echo json_encode($feedback);
    
}
$conn->close();
?>
