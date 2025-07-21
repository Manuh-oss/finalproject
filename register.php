<?php
include("connection1.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $week = $conn->real_escape_string($_POST['week']);
    $admissions = $_POST['admission'];
    $mondays = $_POST['monday'];
    $tuesdays = $_POST['tuesday'];
    $wednesdays = $_POST['wednesday'];
    $thursdays = $_POST['thursday'];
    $fridays = $_POST['friday'];
    $feedback = [];

    foreach($admissions as $index => $admission){
        $admission = $conn->real_escape_string($admissions[$index]);
        $monday = $conn->real_escape_string($mondays[$index]);
        $tuesday = $conn->real_escape_string($tuesdays[$index]);
        $wednesday = $conn->real_escape_string($wednesdays[$index]);
        $thursday = $conn->real_escape_string($thursdays[$index]);
        $friday = $conn->real_escape_string($fridays[$index]);

        $sqlCheck = "SELECT * FROM `weekone` WHERE `week` = '$week' AND `admission` ='$admission'";
        $result = $conn->query($sqlCheck);
        $countRegister = mysqli_num_rows($result);

        if($countRegister > 0){
            $sqlUpdate = "UPDATE `weekone` SET `monday`='$monday',`tuesday`='$tuesday',`wednesday`='$wednesday',`thursday`='$thursday',`friday`='$friday',`admission`='$admission' WHERE `week` = '$week' AND `admission` = '$admission'";

            if($conn->query($sqlUpdate) === TRUE){              
                $feedback = [
                    "message" => "update succesfull",
                    "type" => true
                ];
            }else{
                $feedback = [
                    "message" => "update error".$conn->error,
                    "type" => true
                ];
            }
        }else{
            $sqlInsert = "INSERT INTO `weekone`( `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `admission`, `week`) VALUES ('$monday','$tuesday','$wednesday','$thursday','$friday','$admission','$week')";
            if($conn->query($sqlInsert) === TRUE){              
                $feedback = [
                    "message" => "insertion succesfull",
                    "type" => true
                ];
            }else{
                $feedback = [
                    "message" => "insertion error".$conn->error,
                    "type" => true
                ];
            }

        }

    }
    echo json_encode($feedback);
}
?>