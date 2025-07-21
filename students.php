<?php
include("connection2.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
   $sql = "SELECT * FROM main ORDER BY admission ASC";
   $result = $conn->query($sql);
   
   $students = [];
   
   while($row = $result->fetch_assoc()){
      $students[] = [
       "id"=> $row['Student_id'],  
       "firstname" => $row['firstname'],
       "middlename" => $row['middlename'],
       "lastname" => $row['lastname'],
       "profileImage" => $row['profileImage_path'],
       "admission" => $row['admission'],
       "class" => $row['class'],
       "date" => $row['dateofbirth'],
       "stream" => $row['stream'],
       "email" => $row['email'],
       "gender" => $row['gender'],
       "location" => $row['student_location'],
       "address" => $row['student_address'],
       "chemistry" => $row['chemistry_selection'],
       "english" => $row['english_selection'],
       "kiswahili" => $row['kiswahili_selection'],
       "mathematics" => $row['mathematics_selection'],
       "biology" => $row['biology_selection'],
       "physics" => $row['physics_selection'],
       "geography" => $row['geography_selection'],
       "cre" => $row['cre_selection'],
       "history" => $row['history_selection'],
       "business" => $row['business_selection'],
       "agriculture" => $row['agriculture_selection'],
       "computer" => $row['computer_selection'],
       "french" => $row['french_selection']
      ];
   }

   echo json_encode($students);
}

$conn->close();
?>