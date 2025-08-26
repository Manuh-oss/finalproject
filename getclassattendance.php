<?php
include("connection1.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $sqlGet = "SELECT * FROM `class_register`";
    $reult = $conn->query($sqlGet);
    $feedback = [];
    while($row = $reult->fetch_assoc()){
        $feedback [] = [
          "startStatus" => $row['start_status'],
          "endStatus"  => $row['end_status'],
          "class" => $row['class'],
          "session" => $row['session'],
          "date" => $row['date'],
          "code" => $row['code'],
          "schoolId" => $row['school_id'],
          "day" => $row['day']
        ];
    }
    echo json_encode($feedback);
}
?>