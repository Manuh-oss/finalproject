<?php
include("connection.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
   $sql = "SELECT * FROM teachers ORDER BY teachers_code ASC";
   $result = $conn->query($sql);

   if(!$result){
    echo json_encode([
      "error" => "Error".$conn->error,
      "type" => false
    ]);
   }

   $feedback = [];

   while ($row = $result->fetch_assoc()){
    $feedback[] = [
      "id" => $row['teacher_id'],
      "firstname" => $row['firstname'],
      "middlename" => $row['middlename'],
      "lastname" => $row['lastname'],
      "othername" => $row['othername'],
      "phone" => $row['phone'],
      "email" => $row['email'],
      "identification" => $row['identification'],
      "gender" => $row['gender'],
      "pob" => $row['place'],
      "dob" => $row['dateOfBirth'],
      "degree" => $row['degree'],
      "address" => $row['adress'],
      "university" => $row['university'],
      "std" => $row['startDate'],
      "profileImage" => $row['file_path'],
      "teacherCode" => $row['teachers_code'],
      "rank" => $row['rank'],
      "subjectOne" => $row['subject_one'],
      "subjectTwo" => $row['subject_two'],
      "department" => $row['department'],
      "classTeacher" => $row['classteacher_class'] . "-" . $row['classteacher_stream'],
      "endDate" => $row['endDate'],
      "aboutMe" => $row['aboutMe']
    ];
   }

   echo json_encode($feedback);
}

$conn->close();
?>