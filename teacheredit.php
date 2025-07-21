<?php
include("connection.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
     //names ection
     $firstname = $conn->real_escape_string($_POST['firstname']);
     $middlename = $conn->real_escape_string($_POST['middlename']);
     $lastname = $conn->real_escape_string($_POST['lastname']);
     $othername = $conn->real_escape_string($_POST['othername']);
     //phone , identification ,email date of birth
     $phone = $conn->real_escape_string($_POST['phone']);
     $identification = $conn->real_escape_string($_POST['identification']);
     $email = $conn->real_escape_string($_POST['email']);
     $dateOfBirth = $conn->real_escape_string($_POST['date-of-birth']);
     //place of birth, gender,subject one ,subject two
     $placeOfBirth = $conn->real_escape_string($_POST['place-of-birth']);
     $gender = $conn->real_escape_string($_POST['gender']);
     $subjectOne = $conn->real_escape_string($_POST['subject-one']);
     $subjectTwo = $conn->real_escape_string($_POST['subject-two']);
     //educational details
     $degree = $conn->real_escape_string($_POST['degree']);
     $university = $conn->real_escape_string($_POST['university']);
     $startDate = $conn->real_escape_string($_POST['start-date']);
     $endDate = $conn->real_escape_string($_POST['end-date']);
     //profile image and 
     $address = $conn->real_escape_string($_POST['address']);
     $department = $conn->real_escape_string($_POST['department']);
     $teacherCode = $conn->real_escape_string($_POST['teacher-code']);
     $filename = $_FILES['profile-image']['name'];
     $fileTempName = $_FILES['profile-image']['tmp_name'];
     include("directory.php");
     $uploadDirectory = 'newteachersProfile/';
     $uploadPath = $uploadDirectory . basename($filename);
     $rank = $conn->real_escape_string($_POST['rank']);
 
    if(move_uploaded_file($fileTempName , $uploadPath)){
     
        $sqlUpdate = "UPDATE `teachers` SET `firstname`='$firstname',`middlename`='$middlename',`lastname`='$lastname',`othername`='$othername',`phone`='$phone',`identification`='$identification',`dateOfBirth`='$dateOfBirth',`email`='$email',`gender`='$gender',`place`='$placeOfBirth',`department`='$department',`teachers_code`='$teacherCode',`subject_one`='$subjectOne',`subject_two`='$subjectTwo',`adress`='$address',`degree`='$degree',`university`='$university',`startDate`='$startDate',`endDate`='$endDate',`rank`='$rank' WHERE `teachers_code` = '$teacherCode'";

        if($conn->query($sqlUpdate) === TRUE){
            echo json_encode(
                [
                    "meesage" => "Your details have been updated successfully!",
                    "type" => true
                ]
                );
        }else{
            echo json_encode(
                [
                    "meesage" => "Oops! Something went wrong. Please try again.",
                    "type" => false
                ]
                );
        }

     }else{
        echo json_encode(
            [
                "meesage" => "Oops! Something went wrong. Please try again.".$conn->error,
                "type" => false
            ]
            );
     }
 
}
$conn->close();
?>