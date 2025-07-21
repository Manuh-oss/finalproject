<?php
include("connection2.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $class = $conn->real_escape_string($_POST['class']);
    $subject = $conn->real_escape_string($_POST['subject']);
    $code = $conn->real_escape_string($_POST['code']);
    $type = $conn->real_escape_string($_POST['type']);
    $directory = 'profileImage/';

    //file variables
    $filename = $_FILES['file']['name'];
    $tempname = $_FILES['file']['tmp_name'];
    $filepath = $directory . basename($tempname);

    if(move_uploaded_file($tempname , $filepath)){
      $sqlCheck = "SELECT * FROM `assignment` WHERE `code` = '$code' AND `file_name` = '$filename' AND `class` = '$class' AND `subject` = '$subject'";
      $result = $conn->query($sqlCheck);
      if($result){
        $count = mysqli_num_rows($result);
        
        //if the assignment exist leats update it
        if($count > 0){
            $sqlUpdate = "UPDATE `assignment` SET `file_name`='$filename',`file_path`='$filepath',`subject`='$subject',`class`='$class',`stream`='111',`code`='$code',`type`='$type' WHERE `code` = '$code' AND `file_path` = '$filepath' AND `class` = '$class' AND `subject` = '$class'";
            if($conn->query($sqlUpdate) === true){
                echo json_encode([
                    "message" => "update success",
                    "type" => true
                ]);
            }else{
                echo json_encode([
                    "message" => "error".$conn->error,
                    "type" => false
                ]);
            }
        }else{
           //else just insert it
           $sqlInsert = "INSERT INTO `assignment`(`file_name`, `file_path`, `subject`, `class`, `stream`, `code`,`type`) VALUES ('$filename','$filepath','$subject','$class','111','$code','$type')";
           if($conn->query($sqlInsert) === true){
            echo json_encode([
                "message" => "insert success",
                "type" => true
            ]);
        }else{
            echo json_encode([
                "message" => "error".$conn->error,
                "type" => false
            ]);
        }
        }

      }else{
        echo json_encode([
            "error" => $conn->error
        ]);
      }
    }else{
        echo json_encode([
            "error" => $conn->error
        ]);
    }
}
?>