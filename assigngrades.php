<?php
include("connection2.php");


$sql = "SELECT Student_id, mean FROM studentdetails";
$result = $conn->query($sql);
if($result->num_rows > 0){
    $stmt = $conn->prepare("UPDATE studentdetails SET grade = ? WHERE Student_id = ?");
while($row = $result->fetch_assoc()){
    $id = $row['Student_id'];
    $mark = $row['mean'];
    $grade = assignGrade($mark);

    $stmt->bind_param("si" , $grade ,$id);
    $stmt->execute(); 

}
header("location:position.php");
}else{
   echo "fala";
}
function assignGrade($mark){
   if($mark < 34){
       return "E";
   }elseif($mark <= 39 ){
      if($mark >= 35 ){
       return "D-";
      }
   }elseif($mark <= 44 ){
       if($mark >= 40 ){
        return "D";
       }
    }elseif($mark <= 49 ){
       if($mark >= 45 ){
        return "D+";
       }
    }elseif($mark <= 54 ){
       if($mark >= 50 ){
        return "C-";
       }
    }elseif($mark <= 59 ){
       if($mark >= 55 ){
        return "C";
       }
    }elseif($mark <= 64.5 ){
       if($mark >= 60 ){
        return "C+";
       }
    }elseif($mark <= 69 ){
       if($mark >= 65 ){
        return "B-";
       }
    }elseif($mark <= 74 ){
       if($mark >= 70 ){
        return "B";
       }
    }elseif($mark <= 79 ){
       if($mark >= 75 ){
        return "B+";
       }
    }elseif($mark <= 84 ){
       if($mark >= 80 ){
        return "A-";
       }
    }elseif($mark >= 85){
       return "A";
    }
    }
?>