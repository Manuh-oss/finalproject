<?php
session_start();
$error = "";
include("connection.php"); // connection to database

if($_SERVER['REQUEST_METHOD'] === 'POST'){
   // 1 . Retrieve input fields from php form

        $eventTittle = $conn->real_escape_string($_POST['event-tittle']);
        $eventDate = $conn->real_escape_string($_POST['event-date']);
        $eventTimeFRom = $conn->real_escape_string($_POST['from']);
        $eventTimeTo = $conn->real_escape_string($_POST['to']);
        $eventCategory = $conn->real_escape_string($_POST['category']);
        $eventDestination = $conn->real_escape_string($_POST['destination']);
        $eventDescription = $conn->real_escape_string($_POST['event-description']);
        $user = $conn->real_escape_string($_POST['user']);

        $sqlCheck = "select * FROM events WHERE event_tittle = '$eventTittle' AND event_date = '$eventDate'";
        $resultCheck = $conn->query($sqlCheck);
        $countEvent = mysqli_num_rows($resultCheck);

        if($countEvent > 0){
           echo json_encode([
            "message" => "event already exist",
            "type" => false,
           ]);
        }else{
            $sqlPost = "INSERT INTO events (event_tittle,event_date,event_from,event_to,event_category,event_destination,event_description,user)
                VALUES('$eventTittle','$eventDate','$eventTimeFRom','$eventTimeTo','$eventCategory','$eventDestination','$eventDescription','$user')";
            if($conn->query($sqlPost) === TRUE){
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
}

?>