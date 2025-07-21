<?php
include("connection2.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $date = $conn->real_escape_string($_POST['date']);
    $location = $conn->real_escape_string($_POST['location']);
    $admission = $conn->real_escape_string($_POST['admission']);
    $incident = $conn->real_escape_string($_POST['incident']);
    $action = $conn->real_escape_string($_POST['action']);
    $reportee = $conn->real_escape_string($_POST['user']);
    $feedback = [];

    $sqlCheck = "SELECT * FROM `discplinerecord` WHERE `date` = '$date' AND `admission` = '$admission' AND `incident` = '$incident' ";
    $result = $conn->query($sqlCheck);
    if($result){
        $countIncidents = mysqli_num_rows($result);
         if($countIncidents > 0){
         echo json_encode($countIncidents);
         }else{
            $sqlInsert = "INSERT INTO `discplinerecord`( `admission`, `date`, `incident`, `location`, `reportee`, `action`) VALUES ('$admission','$date','$incident','$location','$reportee','$action')";
            if($conn->query($sqlInsert) === TRUE){
               $feedback = [
                "message" => "success",
                "type" => true
               ];
            }else{
                $feedback = [
                    "message" => "error",
                    "type" => false
                   ];
            }
            }
    }else{
        $feedback = [
            "message" => "no result".$conn->error,
            "type" => false
        ];
    }
    echo json_encode($feedback);
}
?>