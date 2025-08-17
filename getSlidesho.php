<?php
include("connection2.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $sqlGet = "SELECT * FROM `sliders`";
    $result = $conn->query($sqlGet);
    $feedback = [];

    if($result){
        while($row = $result->fetch_assoc()){
            $feedback [] = [
               "img" => $row['sliderImage'],
                "h2" => $row['sliderH2'],
                "p" => $row['slidertP'],
                "id" =>  $row['id'],
                "type" =>  $row['type'],
                "rank" =>  $row['rank'],
                "schoolId" => $row['school_id']
            ];
        }
        echo json_encode($feedback);
    }
}

?>