<?php
include("connection2.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $class = $conn->real_escape_string($_POST['class']);
    $term = $conn->real_escape_string($_POST['term']);
    $exam = $conn->real_escape_string($_POST['exam']);
    $streams = ($_POST['stream']);
    $admissions = $_POST['admission'];
    $feedback = "";

    foreach($admissions as $index => $admissionz){
        $admission = $conn->real_escape_string($admissions[$index]);
        $stream = $conn->real_escape_string($streams[$index]);

        $sqlCheck = "SELECT * FROM `studentdetails` WHERE `class` = '$class' AND `term`= '$term' AND `exam` = '$exam' AND `admission` = '$admission'";
        $result = $conn->query($sqlCheck);
        if($result){
          $countExams = mysqli_num_rows($result);
          if($countExams > 0){
            $sqlUpdate = "UPDATE `studentdetails` SET `class` = '$class',`term` = '$term', `exam`='$exam',`stream` = '$stream' WHERE `admission` = '$admission' AND `class` = '$class' AND `term`= '$term' AND `exam` = '$exam'";
            if($conn->query($sqlUpdate) === true){
                $feedback = [
                    "message" => "update success",
                    "type" => true
                ];
            }else{
                $feedback = [
                    "message" => "contact support",
                    "type" => false,
                    "errorInfo" => $conn->error
                ];
            }
          }else{
            $sqlInsert = "INSERT INTO `studentdetails` (class,term,exam,admission,stream) VALUES('$class','$term','$exam','$admission','$stream')";
            if($conn->query($sqlInsert) === true){
                $feedback = [
                    "message" => "success",
                    "type" => true
                ];
            }else{
                $feedback = [
                    "message" => "contact support",
                    "type" => false,
                    "errorInfo" => $conn->error
                ];
            }
          }
        }else{
            $feedback = [
                "message" => "no result",
                "type" => "false",
                "errorInfo" => $conn->error
            ];
        }
    }
    echo json_encode($feedback);
}
?>