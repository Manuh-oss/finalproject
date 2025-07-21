<?php
include("connection2.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $class = $conn->real_escape_string($_POST['class']);
    $term = $conn->real_escape_string($_POST['term']);
    $exam = $conn->real_escape_string($_POST['exam']);
    $feedback = [];

    if(!empty($class) && !empty($term) && !empty($exam)){
       
        $sqlGet = "SELECT * FROM studentdetails WHERE `class` = '$class' AND `term` = '$term' AND `exam` = '$exam'";
        $result = $conn->query($sqlGet);

        if($result){
            while($row = $result->fetch_assoc()){
               $feedback [] = [
                "admission" => $row['admission'],
                "mathematics" => $row['mathematics'],
                "mathematics_position" => $row['mathematics_position'],
                "english" => $row['english'],
                "english_position" => $row['english_position'],
                "kiswahili" => $row['kiswahili'],
                "kiswahili_position" => $row['kiswahili_position'],
                "chemistry" => $row['chemistry'],
                "chemistry_position" => $row['chemistry_position'],
                "biology" => $row['biology'],
                "biology_position" => $row['biology_position'],
                "physics" => $row['physics'],
                "physics_position" => $row['physics_position'],
                "geography" => $row['geography'],
                "geography_position" => $row['geography_position'],
                "history" => $row['history'],
                "history_position" => $row['history_position'],
                "cre" => $row['cre'],
                "cre_position" => $row['cre_position'],
                "business" => $row['businessstudies'],
                "business_position" => $row['business_position'],
                "agriculture" => $row['agriculture'],
                "agriculture_position" => $row['agriculture_position'],
                "computer" => $row['computer'],
                "computer_position" => $row['computer_position'],
                "french" => $row['french'],
                "french_position" => $row['french_position'],
                "streamPosition" => $row['Total_position'],
                "meanPosition" => $row['mean_position'],
                "total" => $row['Total'],
                "mean" => $row['mean'],
                "meanGrade" => $row['Grade'],
                "exam" => $row['exam'],
                "term" => $row['term'],
                "class" => $row['class'],
                "stream" => $row['stream'],
                "overallPosition" => $row['Totals_position']
               ];
            }
        }else{
            $feedback = [
                "message" => "no result was found",
                "error" => $conn->error,
                "type" => false
            ];
        }

    }else{
       $sqlGet = "SELECT * FROM studentdetails";
        $result = $conn->query($sqlGet);

        if($result){
            while($row = $result->fetch_assoc()){
               $feedback [] = [
                "admission" => $row['admission'],
                "mathematics" => $row['mathematics'],
                "mathematics_position" => $row['mathematics_position'],
                "english" => $row['english'],
                "english_position" => $row['english_position'],
                "kiswahili" => $row['kiswahili'],
                "kiswahili_position" => $row['kiswahili_position'],
                "chemistry" => $row['chemistry'],
                "chemistry_position" => $row['chemistry_position'],
                "biology" => $row['biology'],
                "biology_position" => $row['biology_position'],
                "physics" => $row['physics'],
                "physics_position" => $row['physics_position'],
                "geography" => $row['geography'],
                "geography_position" => $row['geography_position'],
                "history" => $row['history'],
                "history_position" => $row['history_position'],
                "cre" => $row['cre'],
                "cre_position" => $row['cre_position'],
                "business" => $row['businessstudies'],
                "business_position" => $row['business_position'],
                "agriculture" => $row['agriculture'],
                "agriculture_position" => $row['agriculture_position'],
                "computer" => $row['computer'],
                "computer_position" => $row['computer_position'],
                "french" => $row['french'],
                "french_position" => $row['french_position'],
                "streamPosition" => $row['Total_position'],
                "meanPosition" => $row['mean_position'],
                "total" => $row['Total'],
                "mean" => $row['mean'],
                "meanGrade" => $row['Grade'],
                "exam" => $row['exam'],
                "term" => $row['term'],
                "class" => $row['class'],
                "stream" => $row['stream'],
                "overallPosition" => $row['Totals_position']
               ];
            }
    }
   }
    echo json_encode($feedback , JSON_PRETTY_PRINT);
}
?>