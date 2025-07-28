<?php
include("connection.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $code = $conn->real_escape_string($_POST['tcode']);
    $rank = $conn->real_escape_string($_POST['rank']);

    $sqlUpdate = "UPDATE `teachers` SET `rank`='$rank' WHERE `teachers_code`='$code'";

     if($conn->query($sqlUpdate) === TRUE){
            echo json_encode(
                [
                    "meesage" => "Your details have been updated successfully!",
                    "type" => true
                ]
                );
        }else{
            echo json_encode(
                [
                    "meesage" => "Oops! Something went wrong. Please try again.",
                    "type" => false
                ]
                );
    }

}
?>


 
