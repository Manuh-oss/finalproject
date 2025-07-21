<?php
include("connection1.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $sqlGet = "SELECT * FROM `notifications`";
    $result = $conn->query($sqlGet);
    if($result){
       while($row = $result->fetch_assoc()){
         $feedback[] = [
            "message" => $row['message'],
            "destination" => $row['destination'],
            "from" => $row['frum'],
            "type" => $row['type'],
            "desc" => $row['description']
         ];
       } 
       echo json_encode($feedback);
    }else{
        echo json_encode([
            "message" => "contact support",
            "type" => false,
            "errorInfo" => $conn->error
        ]);
    }
}
?>