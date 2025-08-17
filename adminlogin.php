<?php
 include("connection.php");
 session_start();
 if($_SERVER['REQUEST_METHOD'] === 'POST'){
  $username = $conn->real_escape_string($_POST['username']);
  $password = $conn->real_escape_string($_POST['password']);

  $sqlValidate = "SELECT * FROM `teachers` WHERE `email` = '$username' AND `identification` = '$password' AND `rank`='admin'";
  $result = $conn->query($sqlValidate);

  if($result){
    $count = mysqli_num_rows($result);
    $row = $result->fetch_assoc();

    if($count > 0){
      $_SESSION['admission'] = $row['teachers_code'];
      $_SESSION['school_id'] = $row['school_id'];
      $_SESSION['class'] = $row['identification'];
      $_SESSION['stream'] = "";
      $_SESSION['from'] = "admin";
      $_SESSION['email'] = $row['email'];
      $_SESSION['name'] = $row['firstname'];
      header("location:phpmail.php");
    }else{
       echo json_encode([
         "message" => "unvalidated",
         "type" => false
       ]);
    }

  }else{
    echo json_encode([
       "message" => "no results",
       "type" => false,
       "errorInfo" => $conn->error
    ]);
  }

 }
?>