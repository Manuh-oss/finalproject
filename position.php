<?php
include("connection2.php");

$subjects = ['english', 'kiswahili', 'chemistry','mathematics','biology','physics','geography','cre','history','agriculture','french','computer','businessstudies','mean'];
$classQuery = "SELECT DISTINCT class,term,exam  FROM studentdetails";
$classresult = $conn->query($classQuery);
while($classrow = $classresult->fetch_assoc()){
    $class = $classrow['class'];
    $term = $classrow['term'];
    $exam = $classrow['exam'];

    echo $class;
    echo $term;
    echo $exam;
    foreach($subjects as $subject){

$sql = "SELECT  Student_id,firstname,admission,$subject AS marks FROM studentdetails WHERE class = '$class' AND exam = '$exam' AND term = '$term' ORDER BY marks DESC,firstname ASC ";

$result = $conn->query($sql);

if($result->num_rows > 0){
  $students = [];
  while ($row = $result->fetch_assoc()){

        $students[] = $row;
    
  }
 

  //asign position
  $Currentrank = 1;
  $Currentposition = 1;
  $previousposition = null;
  

     foreach($students as &$student){

            if($student['marks'] === $previousposition){
                $student['position'] = $Currentrank;
            }else{
                $Currentrank = $Currentposition;
                $student['position'] = $Currentrank;
            }
            //update database position
            $positioncolumn = "{$subject}_position";
            $updatesql = "UPDATE studentdetails SET $positioncolumn = {$student['position']} WHERE Student_id = {$student['Student_id']}";
            if($conn->query($updatesql) === TRUE){
               echo json_encode([
                "message" => "done done",
                "type" => true
               ]); 
            }
            $previousposition =  $student['marks'];
            $Currentposition++;
      } 

      }else {
        echo json_encode(["message" => "no students found for $subject in class $class"]);
      }
      } 
} 

      