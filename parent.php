<?php
include("connection.php");
if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['firstname'])){
   //1 names section
   $firstname = $conn->real_escape_string($_POST['firstname']);
   $middlename = $conn->real_escape_string($_POST['middlename']);
   $lastname = $conn->real_escape_string($_POST['lastname']);
   //2 phone,identification,type and email
   $phoneNumber = $conn->real_escape_string($_POST['phone']);
   $identification = $conn->real_escape_string($_POST['identification']);
   $type = $conn->real_escape_string($_POST['type']);
   $email = $conn->real_escape_string($_POST['email']);
   //3. class,stream,admission and gendeer
   $class = $conn->real_escape_string($_POST['class']);
   $stream = $conn->real_escape_string($_POST['stream']);
   $admission = $conn->real_escape_string($_POST['admission']);
   $gender = $conn->real_escape_string($_POST['gender']);
   // 4. profile image submittion
   $filename = $_FILES['profile-image']['name'];
   $fileTemplate = $_FILES['profile-image']['tmp_name'];
   $uploadDirectory = 'parentsProfile/';
   $uploadPath = $uploadDirectory . basename($filename);
   $feedback = "";

   if(!empty($filename)){

    if(move_uploaded_file($fileTemplate , $uploadPath)){
        // database check for existence of parent
    
        $sqlCheck = "select * FROM parents1 WHERE admission = '$admission' AND firstname = '$firstname'";
        $checkresult = $conn->query($sqlCheck);
        $countParents = mysqli_num_rows($checkresult);
    
        if($countParents > 2){
          $sqlUpdate = "UPDATE `parents1` SET`firstname`='$firstname',`middlename`='$middlename',`lastname`='$lastname',`email`='$email',`identification`='$identification',`admission`='$admission',`class`='$class',`phone`='$phoneNumber',`gender`='$gender',`stream`='$stream',`type_parent`='$type',`profile_image_name`='$filename',`profile_image_path`='$uploadPath' WHERE`identification`='$identification'";

          if($conn->query($sqlUpdate) === TRUE){
            $feedback = [
              "from" => "parents",
              "type" => true,
              "message" => "success",
            ];
          }else{
             $feedback = [
                  "from" => "parents",
                  "type" => false,
                  "message" => "contact support",
                  "errorInfo" => $conn->error
              ];    
          }

        }else{
            // insert into database if one parent or no parent exist

             $sqlInsert = "INSERT INTO parents1(firstname,middlename,lastname,phone,identification,type_parent,email,class,stream,admission,gender,profile_image_name,profile_image_path)
             VALUES ('$firstname','$middlename','$lastname','$phoneNumber','$identification','$type','$email','$class','$stream','$admission','$gender','$filename','$uploadPath') ";
             
               //check if insertion was succesfull
               if($conn->query($sqlInsert) === TRUE){
                $feedback = [
                  "from" => "parents",
                  "type" => true,
                  "message" => "success",
                ];
              }else{
                 $feedback = [
                      "from" => "parents",
                      "type" => false,
                      "message" => "contact support",
                      "errorInfo" => $conn->error
                  ];    
              }
        }
    
       }else{
       $feedback = [
            "from" => "parents",
            "type" => false,
            "message" => "error! uploading image to database. please contact support.",
            "messageType" => "warning"
        ];
       }
     echo json_encode($feedback);

   }else{
    
    $sqlCheck = "SELECT * FROM parents1 WHERE `admission` = '$admission' AND `identification` = '$identification'";
    $checkresult = $conn->query($sqlCheck);
    $countParents = mysqli_num_rows($checkresult);

    if($countParents > 2){
      $sqlUpdate = "UPDATE `parents1` SET`firstname`='$firstname',`middlename`='$middlename',`lastname`='$lastname',`email`='$email',`identification`='$identification',`admission`='$admission',`class`='$class',`phone`='$phoneNumber',`gender`='$gender',`stream`='$stream',`type_parent`='$type',`profile_image_name`='$filename',`profile_image_path`='$uploadPath' WHERE`identification`='$identification' AND `admission` = '$admission'";

      if($conn->query($sqlUpdate) === TRUE){
        $feedback = [
          "from" => "parents",
          "type" => true,
          "message" => "update success",
        ];
      }else{
         $feedback = [
              "from" => "parents",
              "type" => false,
              "message" => "contact support",
              "errorInfo" => $conn->error
          ];    
      }

    }else{
        // insert into database if one parent or no parent exist

         $sqlInsert = "INSERT INTO parents1(firstname,middlename,lastname,phone,identification,type_parent,email,class,stream,admission,gender)
         VALUES ('$firstname','$middlename','$lastname','$phoneNumber','$identification','$type','$email','$class','$stream','$admission','$gender') ";
         
           //check if insertion was succesfull
           if($conn->query($sqlInsert) === TRUE){
              $feedback = [
                "from" => "parents",
                "type" => true,
                "message" => "success",
              ];
            }else{
               $feedback = [
                    "from" => "parents",
                    "type" => false,
                    "message" => "contact support",
                    "errorInfo" => $conn->error
                ];    
            }
    }
    echo json_encode($feedback);
   }
}else{
   $feedback = [
        "from" => "parents",
        "type" => false,
        "message" => "contact support",
        "errorInfo" => "submittion error"
     ];
     echo json_encode($feedback);
}
$conn->close();
?>