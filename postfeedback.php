<?php
include("connection1.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $messsage = $conn->real_escape_string($_POST['message']);
    $destination = $conn->real_escape_string($_POST['destination']);
    $from = $conn->real_escape_string($_POST['from']);
    $description = $conn->real_escape_string($_POST['description']);
    $type = $conn->real_escape_string($_POST['type']);
    $feedback = "";

    $sqlCheck = "SELECT * FROM `notifications` WHERE `message` = '$messsage' AND `destination` = '$destination' AND `frum` = '$from'";
    $result = $conn->query($sqlCheck);
    if($result){
     $countNotification = mysqli_num_rows($result);
     if($countNotification > 0){
        $sqlUpdate = "UPDATE `notifications` SET `destination`='$destination',`message`='$messsage',`frum`='$from',`description`='$description',`type`='$type' WHERE  `message` = '$messsage' AND `destination` = '$destination' AND `frum` = '$from'";
        
        if($conn->query($sqlUpdate) === true){
          $feedback = [
            "message" => "insert success",
            "type" => true
          ];
        }else{
          $feedback = [
             "message" => "error",
             "type" => false,
             "errorInfo" => $conn->error
          ];
        }
     }else{
        $sqlInsert = "INSERT INTO `notifications`( `destination`, `message`, `frum`, `description`,`type`) VALUES ('$destination','$messsage','$from','$description','$type')";

        if($conn->query($sqlInsert) === true){
          $feedback = [
            "message" => "insert success",
            "type" => true
          ];
        }else{
          $feedback = [
             "message" => "error",
             "type" => false,
             "errorInfo" => $conn->error
          ];
        }
     }
     echo json_encode($feedback);
    }else{
        echo json_encode(["message" => "noresult","errorInfo" => $conn->error , "type" => false]);
    }
}
?>