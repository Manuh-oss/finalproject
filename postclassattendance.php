<?php
include("connection1.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $id = $conn->real_escape_string($_POST['school_id']);
    $code = $conn->real_escape_string($_POST['code']);
    $startStatus = $conn->real_escape_string($_POST['start_status']);
    $endStatus = $conn->real_escape_string($_POST['end_status']);
    $session = $conn->real_escape_string($_POST['session']);
    $day = $conn->real_escape_string($_POST['day']);
    $date = $conn->real_escape_string($_POST['date']);
    $class = $conn->real_escape_string($_POST['class']);
    
    $sqlCheck = "SELECT * FROM `class_register` WHERE `date`='$date'AND`session`='$session'AND`class`='$class'AND`school_id`='$id'";
    $result = $conn->query($sqlCheck);

    if($result){
      
        $countRecords = mysqli_num_rows($result);

        if($countRecords > 0){
            $row = $result->fetch_assoc();
            $endSession = $row['end_status'];
            $sessionId = $row['register_id'];
            if(empty($endSession) || $endSession === ""){
                $sqlUpdate = "UPDATE `class_register` SET `end_status` = '$endStatus' WHERE `register_id`='$sessionId'";
                $status = $conn->query($sqlUpdate);

                if($status){
                    echo json_encode([
                        "message" => "success",
                        "type" => true
                    ]);    
                 }else{
                    echo json_encode([
                        "message" => "error",
                        "type" => false,
                        "errorInfo" => $conn->error
                    ]);
                    }
            }else{
                echo json_encode([
                    "message" => "record was found",
                    "type" => false
                ]);
            }

        }else if($session !== "undefined"){

            $sqlInsert = "INSERT INTO `class_register`( `school_id`, `class`, `session`, `start_status`, `day`, `date`, `code`, `end_status`) VALUES ('$id','$class','$session','$startStatus','$day','$date','$code','$endStatus')";
            $status = $conn->query($sqlInsert);

            if($status){
               echo json_encode([
                  "message" => "success",
                  "type" => true
               ]);    
            }else{
               echo json_encode([
                  "message" => "error",
                  "type" => false,
                  "errorInfo" => $conn->error
               ]);
            }

        }

    }else{
        echo json_encode([
            "message" => "result error",
            "type" => false,
            "errorInfo" => $conn->error
        ]);
    }
}
?>