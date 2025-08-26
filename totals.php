<?php
include("connection2.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
  $means = $_POST['mean'];
  $admissions = $_POST['admission'];
  $ids = $_POST['id'];
  $totals = $_POST['total'];
  $grades = $_POST['grade'];
  $error = null;
$debug = [];
  foreach($admissions as $index => $admis){
    $mean = $conn->real_escape_string($means[$index]);
    $admission = $conn->real_escape_string($admissions[$index]);
    $id = $conn->real_escape_string($ids[$index]);
    $total = $conn->real_escape_string($totals[$index]);
    $grade = $conn->real_escape_string($grades[$index]);

    $class = $conn->real_escape_string($_POST['class']);
    $stream = $conn->real_escape_string($_POST['stream']);
    $term = $conn->real_escape_string($_POST['term']);
    $exam = $conn->real_escape_string($_POST['exam']);

    $sqlUpdate = "UPDATE `studentdetails` SET `mean`='$mean',`Total`='$total',`Totals`='$total',`Grade`='$grade' WHERE `admission`='$admission' AND `class`='$class' AND `stream`='$stream' AND `term`='$term' AND `exam`='$exam'";

    //  if($conn->query($sqlUpdate) !== TRUE){
    //    $error = [
    //     "message" => "error",
    //     "errorInfo" => $conn->error,
    //     "type" => false
    //    ];
    //    break;
    // }

     $debug[] = [
        "mean" => $mean,
        "admission" => $admission,
        "id" => $id,
        "total" => $total,
        "grade" => $grade,
        "sql" => $conn->query($sqlUpdate)
    ];

  }

  echo json_encode($debug);

  //  if($error){
  //     echo json_encode($error);
  //   }else{
  //     echo json_encode([
  //       "message" => "success",
  //       "type" => true,
  //     ]);
  //   }

}

$conn->close();
?>