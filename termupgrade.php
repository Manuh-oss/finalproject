<?php
include("connection2.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $term = $conn->real_escape_string($_POST['term']);
    $id = $conn->real_escape_string($_POST['id']);

    $sqlUpdate = "UPDATE `school-information` SET `term`='$term' WHERE `school_id`='$id'";
    if($conn->query($sqlUpdate) === TRUE){
        echo json_encode([
            "message" => "success",
            "type" => true
        ]);
    }else{
        echo json_encode([
            "message" => "error".$conn->error,
            "type" => false
        ]);
     } 
}
?>