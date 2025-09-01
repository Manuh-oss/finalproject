<?php
include("connection1.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $sqlGet = "SELECT * FROM `notifications`";
    $result = $conn->query($sqlGet);
    if($result){

        if(mysqli_num_rows($result) > 0){

       while($row = $result->fetch_assoc()){
         $feedback[] = [
            "message" => $row['message'],
            "destination" => $row['destination'],
            "from" => $row['frum'],
            "type" => $row['type'],
            "schoolId" => $row['school_id'],
            "desc" => $row['description']
         ];
       } 
       echo json_encode($feedback);
       }else{
         echo json_encode([]);
       }
    }else{
        echo json_encode([
            "message" => "contact support",
            "type" => false,
            "errorInfo" => $conn->error
        ]);
    }
}
?>