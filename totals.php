<?php
include("connection2.php");
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $class     = $conn->real_escape_string($_POST['class']     ?? '');
    $stream    = $conn->real_escape_string($_POST['stream']    ?? '');
    $exam      = $conn->real_escape_string($_POST['exam']      ?? '');
    $term      = $conn->real_escape_string($_POST['term']      ?? '');
    $admission = $conn->real_escape_string($_POST['admission'] ?? '');
    $total     = $conn->real_escape_string($_POST['total']     ?? '');
    $mean      = $conn->real_escape_string($_POST['mean']      ?? '');
    $grade     = $conn->real_escape_string($_POST['grade']     ?? '');
    $subject   = $conn->real_escape_string($_POST['subject']   ?? '');
    $position  = $conn->real_escape_string($_POST['position']  ?? '');

    // Detect mean mode
    if (
        isset($_POST['mean'], $_POST['total'], $_POST['grade']) &&
        $_POST['total'] !== '' &&
        $_POST['grade'] !== '' &&
        $_POST['mean'] !== ''
    ) {
     $sqlUpdate = "UPDATE `studentdetails` SET `mean` = '$mean',`grade`='$grade',`Total`='$total',`Totals` = '$total' WHERE `admission` = '$admission' AND `class` = '$class' AND `exam` = '$exam' AND `term` = '$term'";
          if($conn->query($sqlUpdate) === TRUE){
            $feedback = [
              "message" => "success",
              "admission" => $admission,
              "class" => $class,
              "term" => $term,
              "exam" => $exam,
              "type" => true
            ];
          }else{
            $feedback = [
              "message" => "error",
              "type" => false
            ];
          }
          echo json_encode($feedback);
    }
    elseif (
        isset($_POST['subject'], $_POST['position']) &&
        $_POST['subject'] !== '' &&
        $_POST['position'] !== ''
    ) {
        $sqlUpdate = "UPDATE `studentdetails` SET `{$subject}_position` = '$position' WHERE `admission` = '$admission' AND `class` = '$class' AND `exam` = '$exam' AND `term` = '$term'";

        if($conn->query($sqlUpdate) === TRUE){
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
        echo json_encode($feedback);
    }
    else {
        echo json_encode(["message" => "empty variables noted"]);
    }
}

?>