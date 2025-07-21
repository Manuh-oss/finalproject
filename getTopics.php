<?php
include("connection1.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $class = $conn->real_escape_string($_POST['class']);
    $subject = $conn->real_escape_string($_POST['subject']);

    $sqlGet = "SELECT * FROM `topics` WHERE `class` = '$class' AND `subject` = '$subject'";
    $result = $conn->query($sqlGet);

    $feedback = [];

    while($row = $result->fetch_assoc()){
        $feedback[] = [
           "topic_number" => $row['Topic_number'],
           "topic_tittle" => $row['Topic_heading'],
           "topic_desc" => $row['Topic_brief']
        ];
    }

    echo json_encode($feedback);
}
?>