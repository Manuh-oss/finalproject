<?php
include("connection.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $sql = "select * FROM  teachers_subjects_taught";
    $result = $conn->query($sql);
    
    $teacherSubjects = [];
    
    while($row = $result->fetch_assoc()){
    
        $teacherSubjects[] = [    
            "teacherCode" => $row['teacher_code'],
            "subject" => $row['subject'],
            "class" => $row['class'],
            "stream" => $row['stream']    
        ];
    
    }
    echo json_encode($teacherSubjects);
}

$conn->close();

?>