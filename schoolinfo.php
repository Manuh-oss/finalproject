<?php
include("connection2.php");
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $class = $conn->real_escape_string($_POST['class']);
    $stream = $conn->real_escape_string($_POST['stream']);
    $name = $conn->real_escape_string($_POST['name']);
    $address = $conn->real_escape_string($_POST['address']);
    $subjects = $conn->real_escape_string($_POST['subject']);
    $domain = $conn->real_escape_string($_POST['domain']);
    $email = $conn->real_escape_string($_POST['email']);
    $contacts = $conn->real_escape_string($_POST['contacts']);
    $term = $conn->real_escape_string($_POST['term']);
    $activities = $conn->real_escape_string($_POST['activities']);

    $badgeName = $_FILES['badge']['name'];
    $tmp_badgename = $_FILES['badge']['tmp_name'];
    $dir = 'schoolBadges/';
     if(!is_dir($dir)){
       if(mkdir($dir,0777,true)){
              
       }
      }
    $directory = "schoolBadges/";

    $uploadPath = $directory.basename($badgeName);

    if(move_uploaded_file($tmp_badgename , $uploadPath)){
      $sqlCheck = "SELECT * FROM `school-information` WHERE `school_name`='$name'AND`school_address`='$address'AND`subdomain`='$domain'";
      $result = $conn->query($sqlCheck);

      if($result){
        
        $countSchools = mysqli_num_rows($result);
        if($countSchools > 0){

           $sqlUpdate = "UPDATE `school-information` SET`term`='$term',`school_name`='$name',`email`='$email',`contactInfo`='$contacts',`activities`='$activities',`school_address`='$address',`subjects`='$subjects',`class`='$class',`streams`='$stream',`school_badge`='$uploadPath' WHERE `school_name`='$name'AND`school_address`='$address'AND`subdomain`='$domain'";

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
           $sqlInsert = "INSERT INTO `school-information`(`school_name`, `school_address`, `subjects`, `class`, `streams`,`school_badge`,`subdomain`,`email`,`activities`,`contactInfo`,`term`) VALUES ('$name','$address','$subjects','$class','$stream','$uploadPath','$domain','$email','$activities','$contacts','$term')";
            if($conn->query($sqlInsert)){
                   $sqlId = "SELECT `school_id`,`subdomain` FROM `school-information` WHERE `school_name`='$name' AND `school_address`='$address'";
                        $idresult = $conn->query($sqlId);

                        if ($idresult && $row = $idresult->fetch_assoc()) {
                            echo json_encode([
                                "message" => "insert success",
                                "schoolId" => $row['school_id'],
                                "domain" => $row['subdomain'],
                                "type" => true,
                            ]);
                        } else {
                            echo json_encode([
                                "message" => "error fetching school ID",
                                "errorInfo" => $conn->error,
                                "type" => false,
                            ]);
                        }
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
          "type" => false,
          "errorInfo" => $conn->error
        ]);
      }

    }

}
$conn->close();
?>