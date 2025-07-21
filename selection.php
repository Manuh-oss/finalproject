<?php
include("connection2.php");
if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['admissions'])){

    $admissions = ($_POST['admissions']);

    $selections = ($_POST['selections']);

    $subject = $_POST['subject'];

    $location = "{$subject}_selection";

    $feedBack = [];

    foreach($admissions as $index => $admission){
      $selection = $selections[$index];
      $safeAdmis = $conn->real_escape_string($admission); 
      $safeSelect = $conn->real_escape_string($selection); 
      $stmt = $conn->prepare("UPDATE `main` SET `$location` = ? WHERE admission = '$safeAdmis'" );
      $stmt->bind_param("s" , $safeSelect);
      $stmt->execute();


      if($stmt->execute()){
        $feedBack = [
          "message" => "success",
          "type" => true
        ];
      }else{
        $feedBack = [
          "message" => "error",
          "type" => false
        ];
      }
    }

    echo json_encode($feedBack);
    

}else{
   echo "form not submitted";
}
$conn->close();
?>