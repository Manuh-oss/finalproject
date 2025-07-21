<?php
include("connection.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $sqlGet = "SELECT * FROM `events` ORDER BY event_arrival_time ASC";
    $result = $conn->query($sqlGet);
    $feedback = [];
    if($result){
            while($row = $result->fetch_assoc()){
              $feedback [] = [
                "tittle" => $row['event_tittle'],
                "date" => $row['event_date'],
                "description" => $row['event_description'],
                "category" => $row['event_category'],
                "destination" => $row['event_destination'],
                "from" => $row['event_from'],
                "user" => $row['user'],
                "to" => $row['event_to']
              ];
            }
            echo json_encode($feedback);
    }
}
?>