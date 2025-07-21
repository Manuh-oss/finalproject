<?php
include("connection1.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $topicNumbers = $_POST['topic-number'];
    $topicHeading = $_POST['topic-tittle'];
    $topicDesc = $_POST['topic-description'];
    $class = $conn->real_escape_string($_POST['class']);
    $subject = $conn->real_escape_string($_POST['subject']);

    $feedback = [];

    foreach($topicNumbers as $index => $topicNumber ){
        $topicTittle = $conn->real_escape_string($topicHeading[$index]);
        $topicNo = $conn->real_escape_string($topicNumbers[$index]);
        $topicDe = $conn->real_escape_string($topicDesc[$index]);

        $sqlCheck = "SELECT * FROM `topics` WHERE `Topic_heading` = '$topicTittle'";
        $result = $conn->query($sqlCheck);
        $countTopic = mysqli_num_rows($result);

        if($countTopic > 0){
            $sqlUpdate = "UPDATE `topics` SET `Topic_number`='$topicNo',`Topic_heading`='$topicTittle',`Topic_brief`='$topicDe' WHERE `subject`='$subject' AND `class`='$class' AND `Topic_number`='$topicNo'";
            
            if($conn->query($sqlUpdate) === TRUE){
                $feedback = [
                    "message" => "update success",
                    "type" => true
                ];
            }else{
                $feedback = [
                    "message" => "update failed".$conn->error,
                    "type" => false
                ];
            }
        }else{
          $sql = "INSERT INTO `topics`( `Topic_number`, `Topic_heading`, `Topic_brief`, `subject`, `class`) VALUES ('$topicNo','$topicTittle','$topicDe','$subject','$class')";

                if($conn->query($sql) === TRUE){
                    $feedback = [
                        "message" => "success",
                        "type" => true
                    ];
                }else{
                    $feedback = [
                        "message" => "errors".$conn->error,
                        "type" => false
                    ];
                }}
       
    }

    echo json_encode($feedback);
}
?>