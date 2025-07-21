<?php
include("connection1.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $result = [];
    $sqlGet = "SELECT * FROM `notes`";
    $resultGet = $conn->query($sqlGet);

    if ($resultGet && $resultGet->num_rows > 0) {
        while($row = $resultGet->fetch_assoc()){
            $result[] = [
                "class" => $row['class'],
                "subject" => $row['subject'],
                "topic" => $row['topic'],
                "notes" => $row['paragraph'],
                "teacherCode" => $row['teacherCode']
            ];
        };
    } else {
        $result[] = [
            "message" => "No notes found for the provided class, subject, and topic."
        ];
    }

    echo json_encode($result);
} else {
    echo json_encode(["message" => "Form not submitted"]);
}
?>
