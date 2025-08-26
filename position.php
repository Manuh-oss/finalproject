<?php
include("connection2.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
  $admissions = $_POST['admission'];
  $subjects = $_POST['subject'];
  $positions = $_POST['position'];
  $streamPositions = $_POST['streamPosition'];
  $ids = $_POST['id'];
  $error = null;

  foreach($admissions as $index => $admis){
    $admission = $conn->real_escape_string($admissions[$index]);
    $subject = $conn->real_escape_string($subjects[$index]);
    $position = $conn->real_escape_string($positions[$index]);
    $streamPosition = $conn->real_escape_string($streamPositions[$index]);
    $id = $conn->real_escape_string($ids[$index]);
  
    $sqlUpdate = "UPDATE `studentdetails` SET `{$subject}_position`='$position',`Total_position`='$streamPosition' WHERE `admission`='$admission' AND `Student_id`='$id'";

    if($conn->query($sqlUpdate) !== TRUE){
       $error = [
        "message" => "error",
        "errorInfo" => $conn->error,
        "type" => false
       ];
       break;
    }

  }

  if($error){
    echo json_encode($error);
  }else{
    echo json_encode([
      "message" => "success",
      "type" => true
    ]);
  }

}

$conn->close();
?> 

      