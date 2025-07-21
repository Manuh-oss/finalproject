<?php
include("connection2.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $sqlGet = "SELECT * FROM `discplinerecord`";
    $result = $conn->query($sqlGet);
    $feedback = [];
    if($result){
        while($row = $result->fetch_assoc()){
            $feedback [] = [
               "admission" => $row['admission'],
               "incident" => $row['incident'],
               "date" => $row['date'],
               "action" => $row['action'],
               "teacher" => $row['reportee'],
               "location" => $row['location']
            ];
        }
        echo json_encode($feedback);
    }
}
?>