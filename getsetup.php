<?php
include("connection2.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $sqlGet = "SELECT * FROM `school-information`";
    $result = $conn->query($sqlGet);

    if($result){

        while($row = $result->fetch_assoc()){
            $feedback [] = [
                "schoolId" => $row['school_id'],
                "schoolName" => $row['school_name'],
                "subjects" => $row['subjects'],
                "clases" => $row['class'],
                "streams" => $row['streams'],
                "layout" => $row['layout'],
                "adress" => $row['school_address'],
                "badge" => $row['school_badge']
            ];
            echo json_encode($feedback);
        }

    }else{
        echo json_encode([
            "message" => "no result found",
            "type" => false,
            "errorInfo" => $conn->error
        ]); 
    }

}

?>