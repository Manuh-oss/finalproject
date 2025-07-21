<?php
include("connection2.php");
  if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['firstname'])){
   $feedback = "";
    // 1. names section
     $firstname = $conn->real_escape_string($_POST['firstname']);
     $middlename = $conn->real_escape_string($_POST['middlename']);
     $lastname = $conn->real_escape_string($_POST['lastname']);
     $othername = $conn->real_escape_string($_POST['othername']);
     //2. date,admission,gender and location
     $dateOfBirth = $conn->real_escape_string($_POST['date-of-birth']);
     $location = $conn->real_escape_string($_POST['residence']);
     $admission = $conn->real_escape_string($_POST['admission']);
     $gender = $conn->real_escape_string($_POST['gender']);
     //3. class,email,adress and stream 
     $class = $conn->real_escape_string($_POST['class']);
     $stream = $conn->real_escape_string($_POST['stream']);
     $email = $conn->real_escape_string($_POST['email']);
     $address = $conn->real_escape_string($_POST['address']);
     //4. image submittion
    // include("directory.php");
     $file = $_FILES['profile-image']['name'];
     $fileTemplateName = $_FILES['profile-image']['tmp_name'];
     $uploadDirectory = 'profileImages/';
     $uploadPath = $uploadDirectory . basename($file);

     if(!empty($file)){
        if(move_uploaded_file($fileTemplateName , $uploadPath)){
          //check if student exist
          $sqlCheck = "SELECT * FROM `main` WHERE `admission` = '$admission'";
          $checkResult = $conn->query($sqlCheck);
          $countStudents = mysqli_num_rows($checkResult);
          if($countStudents > 0){
            $sqlUpdate = "UPDATE `main` SET `firstname`='$firstname',`middlename`='$middlename',`lastname`='$lastname',`othername`='$othername',`email`='$email',`admission`='$admission',`dateofbirth`='$dateOfBirth',`class`='$class',`stream`='$stream',`gender`='$gender',`profileImage_name`='$file',`profileImage_path`='$uploadPath',`student_location`='$location',`student_address`='$address' WHERE `admission` = '$admission'";

                if($conn->query($sqlUpdate) === TRUE){          
                  $feedback = [
                    "from" => "students",
                    "type" => true,
                    "message" => "update success"
                ];
              }else{
                $feedback = [
                      "from" => "students",
                      "type" => false,
                      "message" => "contact support",
                      "errorInfo" => $conn->error
                  ];        
              }
              
          }else{
              //insert into database if the admission number does not exist  
        
          $sqlInsert = "INSERT INTO main(firstname,middlename,lastname,othername,dateofbirth,student_location,admission,gender,class,stream,email,student_address,profileImage_name,profileimage_path) 
          VALUES('$firstname','$middlename','$lastname','$othername','$dateOfBirth','$location','$admission','$gender','$class','$stream','$email','$address','$file','$uploadPath')";

            //check if insertion was succesfull
          if($conn->query($sqlInsert) === TRUE){          
              $feedback = [
                "from" => "students",
                "type" => true,
                "message" => "success",
                "messageType" => "warning"
            ];
          }else{
            $feedback = [
                  "from" => "students",
                  "type" => false,
                  "message" => "contact support",
                  "errorInfo" => $conn->error
              ];        
          }
        }
        }    
     }else{
      
      $sqlCheck = "SELECT * FROM `main` WHERE `admission` = '$admission'";
      $checkResult = $conn->query($sqlCheck);
      $countStudents = mysqli_num_rows($checkResult);

      if($countStudents > 0){
        $sqlUpdate = "UPDATE `main` SET `firstname`='$firstname',`middlename`='$middlename',`lastname`='$lastname',`othername`='$othername',`email`='$email',`admission`='$admission',`dateofbirth`='$dateOfBirth',`class`='$class',`stream`='$stream',`gender`='$gender',`student_location`='$location',`student_address`='$address' WHERE `admission` = '$admission'";

          if($conn->query($sqlUpdate) === TRUE){          
            $feedback = [
              "from" => "students",
              "type" => true,
              "message" => "update success"
          ];
        }else{
          $feedback = [
                "from" => "students",
                "type" => false,
                "message" => "contact support",
                "errorInfo" => $conn->error
            ];        
        }

      }else{

            $sqlInsert = "INSERT INTO main(firstname,middlename,lastname,othername,dateofbirth,student_location,admission,gender,class,stream,email,student_address) 
            VALUES('$firstname','$middlename','$lastname','$othername','$dateOfBirth','$location','$admission','$gender','$class','$stream','$email','$address')";

              //check if insertion was succesfull
            if($conn->query($sqlInsert) === TRUE){          
                $feedback = [
                  "from" => "students",
                  "type" => true,
                  "message" => "success"
              ];
            }else{
              $feedback = [
                    "from" => "students",
                    "type" => false,
                    "message" => "contact support",
                    "errorInfo" => $conn->error
                ];        
            }
          }
         } 
     echo json_encode($feedback);
  }else{
    $feedback = [
        "from" => "students",
        "type" => false,
        "message" => "form was not submitted",
        "errorInfo" => "error"
     ];     
     echo json_encode($feedback);
     
  }

  $conn->close();
?>