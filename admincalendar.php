<?php
include("connection2.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
  $title = $conn->real_escape_string($_POST['h2']);
  $description = $conn->real_escape_string($_POST['p']);
  $id = $conn->real_escape_string($_POST['school_id']);
  $idz = $conn->real_escape_string($_POST['id']);
  $type = $conn->real_escape_string($_POST['type']);
  $rank = $conn->real_escape_string($_POST['rank']);

  $imageName = $_FILES['image']['name'];
  $tmp_name = $_FILES['image']['tmp_name'];
  include("directory.php");
  $directory = "slider/";

  $uploadPath = $directory.basename($imageName);

  if(move_uploaded_file($tmp_name , $uploadPath)){
    
    $sqlCheck = "SELECT * FROM `sliders` WHERE `school_id` ='$id' AND `id`='$idz'";
    $result = $conn->query($sqlCheck);

    if($result){
      $countResult = mysqli_num_rows($result);

      if($countResult > 0){
        $sqlUpdate = "UPDATE `sliders` SET `sliderImage`='$uploadPath',`sliderH2`='$title',`slidertP`='$description',`rank`='$rank',`type`='$type'WHERE `school_id`='$id' AND `id`='$idz'";

         if($conn->query($sqlUpdate)){
         echo json_encode([
            "message" => "update success",
            "type" => true,
         ]);
        }else{
          echo json_encode([
            "message" => "error",
            "errorInfo" => $conn->error,
            "type" => true,
         ]);
        }

      }else{
        $sqlInsert = "INSERT INTO `sliders`(`sliderImage`, `sliderH2`, `slidertP`, `school_id`,`rank`,`type`) VALUES ('$uploadPath','$title','$description','$id','$rank','$type')";

        if($conn->query($sqlInsert)){
         echo json_encode([
            "message" => "insert success",
            "type" => true,
         ]);
        }else{
          echo json_encode([
            "message" => "error",
            "errorInfo" => $conn->error,
            "type" => true,
         ]);
        }

      }

    }else{
      echo json_encode([
        "message" => "no result",
        "type" =>false,
        "errorInfo" => $conn->error,
    ]);
    }

  }else{
    echo json_encode([
      "message" => "image error",
      "type" =>false,
      "errorInfo" => $conn->error,
    ]);
  }

}
?>
