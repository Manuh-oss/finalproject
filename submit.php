<?php
include("connection.php");


if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $fileLocation = 'submit.json';

    $class = $conn->real_escape_string($_POST['class']);
    $stream = $conn->real_escape_string($_POST['stream']);
    $subject = $conn->real_escape_string($_POST['subject']);
    $id = $conn->real_escape_string($_POST['id']);
    $teacherCode = $conn->real_escape_string($_POST['teacher-code']);

    $sqlCheck = "SELECT * FROM teachers_subjects_taught WHERE `class` = '$class' AND `stream` = '$stream' AND `subject` = '$subject'AND`school_id`='$id'";
    $resultFromSql = $conn->query($sqlCheck);
    $count_lessons = mysqli_num_rows($resultFromSql);

    if($count_lessons > 0){
     
        $sqlUpdate = "UPDATE `teachers_subjects_taught` SET `teacher_code`='$teacherCode',`class`='$class',`stream`='$stream',`subject`='$subject' WHERE `class`='$class'AND`stream`='$stream'AND`subject`='$subject'";

        if($conn->query($sqlUpdate) === TRUE){
            $feedback = [
                "type" => true,
                "messsage" => "congratulations! teacher's lesson added."
              ];
              echo json_encode ($feedback);
        }else{
            $feedback = [
                "type" => false,
                "messsage" => "contact support",
                "errorInfo" => $conn->error
              ];
              echo json_encode ($feedback);
        }

    }else{

        $sqlInsert = "INSERT INTO `teachers_subjects_taught`( `teacher_code`, `class`, `stream`, `subject`,`school_id`) VALUES ('$teacherCode','$class','$stream','$subject','$id')";

        if($conn->query($sqlInsert) === TRUE){
            $feedback = [
                "type" => true,
                "messsage" => "congratulations! teacher's lesson added."
              ];
              echo json_encode ($feedback);
        }else{
            $feedback = [
                "type" => false,
                "messsage" => "contact support",
                "errorInfo" => $conn->error
              ];
              echo json_encode ($feedback);
        }
    }

}else{
    $feedback = [
        "type" => false,
        "messsage" => "contact support",
        "errorInfo" => $conn->error
      ];
      echo json_encode ($feedback);
}
?>