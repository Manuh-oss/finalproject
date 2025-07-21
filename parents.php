<?php
include("connection.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $sql = "SELECT * FROM `parents1`";
    $result = $conn->query($sql);
    if($result){
        while($row = $result->fetch_assoc()){
          $feedback [] = [
            "firstname" => $row['firstname'],
            "middlename" => $row['middlename'],
            "lastname" => $row['lastname'],
            "profileImage" => $row['profile_image_path'],
            "admission" => $row['admission'],
            "class" => $row['class'],
            "stream" => $row['stream'],
            "email" => $row['email'],
            "gender" => $row['gender'],
            "idnumber" => $row['identification'],
            "phone" => $row['phone'],
            "parentType" => $row['type_parent']
          ];
        }
        echo json_encode($feedback);
    }else{
        echo json_encode([]);
    }
}
?>