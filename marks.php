<?php
include("connection2.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $class = $conn->real_escape_string($_POST['class']);
    $stream = $conn->real_escape_string($_POST['stream']);
    $term = $conn->real_escape_string($_POST['term']);
    $exam = $conn->real_escape_string($_POST['exam']);
    $subject = $conn->real_escape_string($_POST['subject']);

    $sqlCheck = "SELECT main.firstname,main.middlename,main.lastname,main.admission,main.gender,studentdetails.Student_id,
    studentdetails.class,studentdetails.stream,studentdetails.term,studentdetails.exam, studentdetails.`$subject` AS subjects
    FROM main JOIN studentdetails ON main.admission = studentdetails.admission WHERE studentdetails.class = '$class' AND studentdetails.stream = '$stream' AND studentdetails.term = '$term' AND studentdetails.exam = '$exam' ORDER BY main.admission ASC";

    $result = $conn->query($sqlCheck);

    if (!$result) {
        echo json_encode([
            "subject" => $subject,
            "status" => "error",
            "message" => "SQL Error: " . $conn->error,
            "query" => $sqlCheck // Optional: remove this after debugging
        ]);
        exit;
    }

   $feedBack = [];

    while($row = $result->fetch_assoc()){
       $feedBack [] = [
        "id" => $row['Student_id'],
        "firstname" => $row['firstname'],
        "middlename" => $row['middlename'],
        "lastname" => $row['lastname'],
        "admission" => $row['admission'],
        "gender" => $row['gender'],
        "class" => $row['class'],
        "stream" => $row['stream'],
        "term" => $row['term'],
        "exam" => $row['exam'],
        "subject" => $row['subjects']
       ];
    };

    header('Content-Type: application/json');
    
    echo json_encode($feedBack);

    $fileLocation = "marks.json";

    file_put_contents($fileLocation , json_encode($feedBack , JSON_PRETTY_PRINT));
    
}
?>