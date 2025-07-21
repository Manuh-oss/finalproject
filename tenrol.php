<?php
include("connection.php");
if($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['firstname'])){
    $fileLocation = 'message.json';
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
    //classteacherr information
    $class = $conn->real_escape_string($_POST['class']);
    $stream = $conn->real_escape_string($_POST['stream']);
    $rank = $conn->real_escape_string($_POST['rank']);
    //profile image and 
    $address = $conn->real_escape_string($_POST['address']);
    $department = $conn->real_escape_string($_POST['department']);
    $teacherCode = $conn->real_escape_string($_POST['teacher-code']);
    $filename = $_FILES['profile-image']['name'];
    $fileTempName = $_FILES['profile-image']['tmp_name'];
    include("directory.php");
    $uploadDirectory = 'teachersProfile/';
    $uploadPath = $uploadDirectory . basename($filename);

    if(!empty($filename)){
        if(move_uploaded_file($fileTempName , $uploadPath)){
       
            //check for existence of teacher in database
            $sql = "SELECT * FROM teachers WHERE firstname = '$firstname'  AND identification = '$identification' AND phone = '$phone'";
            $result = $conn->query($sql);
            $countTeachers = mysqli_num_rows($result);
         
            if($countTeachers > 0){
                $sqlUpdate = "UPDATE `teachers` SET `firstname`='$firstname',`middlename`='$middlename',`lastname`='$lastname',`othername`='$othername',`phone`='$phone',`identification`='$identification',`dateOfBirth`='$dateOfBirth',`email`='$email',`gender`='$gender',`place`='$placeOfBirth',`department`='$department',`teachers_code`='$teacherCode',`subject_one`='$subjectOne',`subject_two`='$subjectTwo',`adress`='$address',`degree`='$degree',`university`='$university',`startDate`='$startDate',`endDate`='$endDate',`file_name`='$filename',`file_path`='$uploadPath',`classteacher_class`='$class',`classteacher_stream`='$stream',`rank`='$rank' WHERE `identification` = '$identification'";

                if($conn->query($sqlUpdate) === TRUE){
                    $error = [
                        "type" => true,
                        "message" => "update success",
                      ];
                      echo json_encode($error);
                }else{
                    $error = [
                        "type" => false,
                        "message" => "contact support",
                        "errorInfo" => $conn->error
                      ];
                      echo json_encode($error);
                }

            }else{
                $sqlInsert = "INSERT INTO teachers (firstname,middlename,lastname,othername,phone,identification,email,dateOfBirth,place,gender,subject_one,subject_two,degree,university,startDate,endDate,adress,file_name,file_path,department,teachers_code)
                VALUES('$firstname','$middlename','$lastname','$othername','$phone','$identification','$email','$dateOfBirth','$placeOfBirth','$gender','$subjectOne','$subjectTwo','$degree','$university','$startDate','$endDate','$address','$filename','$uploadPath','$department','$teacherCode')";
    
                if($conn->query($sqlInsert) === TRUE){
                    $error = [
                        "type" => true,
                        "message" => "success",
                      ];
                      echo json_encode($error);
                }else{
                    $error = [
                        "type" => false,
                        "message" => "error insertion",
                        "errorInfo" => $conn->error
                      ];
                      echo json_encode($error);
                }
            }
    
        }else{
            $error = [
              "type" => false,
              "message" => " please contact support.",
              "errorInfo" => $conn->error,
            ];
            echo json_encode($error);
        }
    }else{
        $sql = "SELECT * FROM teachers WHERE firstname = '$firstname'  AND identification = '$identification' AND phone = '$phone'";
        $result = $conn->query($sql);
        $countTeachers = mysqli_num_rows($result);
     
        if($countTeachers > 0){
            $sqlUpdate = "UPDATE `teachers` SET `firstname`='$firstname',`middlename`='$middlename',`lastname`='$lastname',`othername`='$othername',`phone`='$phone',`identification`='$identification',`dateOfBirth`='$dateOfBirth',`email`='$email',`gender`='$gender',`place`='$placeOfBirth',`department`='$department',`teachers_code`='$teacherCode',`subject_one`='$subjectOne',`subject_two`='$subjectTwo',`adress`='$address',`degree`='$degree',`university`='$university',`startDate`='$startDate',`endDate`='$endDate',`classteacher_class`='$class',`classteacher_stream`='$stream',`rank`='$rank' WHERE `identification` = '$identification'";

            if($conn->query($sqlUpdate) === TRUE){
                $error = [
                    "type" => true,
                    "message" => "update success",
                    "errorInfo" => $class.$stream
                  ];
                  echo json_encode($error);
            }else{
                $error = [
                    "type" => false,
                    "message" => "contact support",
                    "errorInfo" => $conn->error
                  ];
                  echo json_encode($error);
            }

        }else{
            $sqlInsert = "INSERT INTO teachers (firstname,middlename,lastname,othername,phone,identification,email,dateOfBirth,place,gender,subject_one,subject_two,degree,university,startDate,endDate,adress,department,teachers_code)
            VALUES('$firstname','$middlename','$lastname','$othername','$phone','$identification','$email','$dateOfBirth','$placeOfBirth','$gender','$subjectOne','$subjectTwo','$degree','$university','$startDate','$endDate','$address','$department','$teacherCode')";

            if($conn->query($sqlInsert) === TRUE){
                $error = [
                    "type" => true,
                    "message" => "success",
                  ];
                  echo json_encode($error);
            }else{
                $error = [
                    "type" => false,
                    "message" => "error insertion",
                    "errorInfo" => $conn->error
                  ];
                  echo json_encode($error);
            }
        }

    }

}else{
    $error = [
        "type" => false,
        "message" => "error! form has not been submitted.",
      ];
      echo json_encode($error);
}
$conn->close();
?>