<?php
include("connection2.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
   $idz = $conn->real_escape_string($_POST['id']);
   $sqlDelete = "DELETE FROM `sliders` WHERE `id` = '$idz'";
    if($conn->query($sqlDelete)){
      echo json_encode([
            "message" => "delete success",
            "type" => true,
         ]);
    }else{
      echo json_encode([
            "message" => "error",
            "type" => false,
            "errorInfo" => $conn->error
        ]);
    }
}
?>