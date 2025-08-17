<?php
include("connection.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $subject = $conn->real_escape_string($_POST['subject']);
    $teacherCode = $conn->real_escape_string($_POST['tcode']);
    $id = $conn->real_escape_string($_POST['id']);

    $sql = "SELECT * FROM  teachers WHERE rank = 'H.O.D' AND teachers_code = '$teacherCode'AND`school_id`='$id'";
    $result = $conn->query($sql);
   $validate = mysqli_num_rows($result);


    if($validate > 0){
      $feedback = [
        "message" => "validated",
        "type" => true
      ];
    }else{
        $feedback = [
            "message" => "unvalid",
            "type" => false
        ];
    }

    echo json_encode($feedback);

}
?>