<?php

include("connection2.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $class = $conn->real_escape_string($_POST['class']);
        
        $sqlAll = "SELECT COUNT(*) AS allcount FROM main WHERE `class` = '$class'";
        $resultOne = $conn->query($sqlAll);
        $rowOne = $resultOne->fetch_assoc();
        $allCount = (int)$rowOne['allcount'];

        $response = [
            "allcount" => (int)$rowOne['allcount']
        ];

        $sqlStream = "SELECT stream, COUNT(*) AS streamcount FROM main WHERE `class` = '$class' GROUP BY stream";
        $resultTwo = $conn->query($sqlStream);
        $streamCounts = [];
        while ($row = $resultTwo->fetch_assoc()) {
            $streamCounts[] = $row;
            $response[$row['stream']] = (int)$row['streamcount'];
        }


        $subjects = ['chemistry','biology','physics','geography','cre','history','agriculture','french','computer','business','english','kiswahili','mathematics'];
        $subjectCounts = [];

        foreach ($subjects as $subject) {
            $sqlSubject = "SELECT COUNT(*) AS subjectCount 
                        FROM main 
                        WHERE `class` = '$class' AND `{$subject}_selection` IN ('selected' , '') ";
            
            $result = $conn->query($sqlSubject);
            $row = $result->fetch_assoc();
            $response[$subject] = (int)$row['subjectCount'];
        }

        echo json_encode($response);

}

?>