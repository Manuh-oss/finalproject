<?php
include("connection.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $class = $conn->real_escape_string($_POST['class']);
    $stream = $conn->real_escape_string($_POST['stream']);
    $subject = $conn->real_escape_string($_POST['subject']);
    $teacherCode = $conn->real_escape_string($_POST['tcode']);
    $id = $conn->real_escape_string($_POST['id']);

    $sql = "SELECT * FROM  teachers_subjects_taught WHERE class = '$class' AND stream = '$stream' AND subject = '$subject' AND teacher_code = '$teacherCode'AND`school_id`='$id'";
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