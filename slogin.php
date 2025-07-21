<?php
session_start();
if($_SERVER['REQUEST_METHOD'] === 'POST'){

   $usernames = ($_POST['user']);
   $passwords = ($_POST['pass']);
   $tUsername = ($_POST['username']);
   $tPassword = ($_POST['password']);

   //if user is student
   if(!empty($usernames) && !empty($passwords)){
      include("connection2.php");
      $user = $conn->real_escape_string($usernames);
      $pass = $conn->real_escape_string($passwords);
      $sql = "SELECT * FROM main WHERE firstname = '$user' AND admission = '$pass'";
      $result = $conn->query($sql);
      $count_user = mysqli_num_rows($result);
      $row = $result->fetch_assoc();
      $credentials = [];
   
      if($count_user > 0){
        $_SESSION['admission'] = $row['admission'];      
        $_SESSION['class'] = $row['class'];      
        $_SESSION['stream'] = $row['stream'];      
        $_SESSION['from'] = "student";  
         
       $error = [
           "message" => "success",
           "from" => "student",
           "type" => true
         ];
   
         echo json_encode($error);
      }else{
         $error = [
           "message" => "invalid",
           "type" => false
         ];
   
         echo json_encode($error);
      }
   }else if(!empty($tPassword) && !empty($tUsername)){  
      include("connection.php");
      $sql = "SELECT * FROM teachers WHERE email = '$tUsername' AND identification = '$tPassword'";
      $result = $conn->query($sql);
  
      if ($result->num_rows > 0) {
          $row = $result->fetch_assoc();
  
          //  Set session variable
          $_SESSION['admission'] = $row['teachers_code']; 
          $_SESSION['class'] = $row['identification']; 
          $_SESSION['stream'] = "green";
          $_SESSION['from'] = "teacher";
          //  Response to JS
          echo json_encode([
              "message" => "success",
              "from" => "teacher",
              "type" => true
          ]);
  
      } else {
          echo json_encode([
              "message" => "wrong credentials please try again",
              "type" => false
          ]);
      }
   }
   
}else{
   echo "Am not working";
}
?>