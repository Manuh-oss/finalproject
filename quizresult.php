<?php
include("connection1.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){

    $admision = $conn->real_escape_string($_POST['admission']);
     $feedback = [];
    if(!empty($admision)){
        $sql = "SELECT * FROM `student_quiz_result` WHERE admission = '$admision'";
        $result = $conn->query($sql);
           
        while($row = $result->fetch_assoc()){
            $feedback[] = [
                "attempt" => $row['attempt'],
                "quizCode" => $row['quizCode'],
                "admission" => $row['admission'],
                "topic" => $row['topic'],
                "date" => $row['attemptDate'],
                "score" => $row['score']
            ];
        }
    }else{
       $sql = "SELECT * FROM `student_quiz_result`";
       $result = $conn->query($sql);
            
       while($row = $result->fetch_assoc()){
         $feedback[] = [
            "attempt" => $row['attempt'],
            "quizCode" => $row['quizCode'],
            "admission" => $row['admission'],
            "topic" => $row['topic'],
            "date" => $row['attemptDate'],
            "score" => $row['score']
          ];
       }
    }
      
    echo json_encode($feedback);
}
$conn->close();
?>