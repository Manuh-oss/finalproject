<?php
include("connection2.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $sqlGet = "SELECT * FROM `assignment`";
    $result = $conn->query($sqlGet);
    $feedback = [];
    if($result){
        while($row = $result->fetch_assoc()){
          $feedback [] = [
            "class" => $row['class'],
            "subject" => $row['subject'],
            "stream" => $row['stream'],
            "fileName" => $row['file_name'],
            "path" => $row['file_path'],
            "type" => $row['type'],
            "code" => $row['code']
          ];
        }
        echo json_encode($feedback);
    }else{
        echo json_encode([
            "error" => $conn->error
        ]);
    }
}
?>