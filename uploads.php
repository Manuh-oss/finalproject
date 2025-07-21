<?php
if(($_FILES['file']['error'] === UPLOAD_ERR_OK)){
    echo "yoh";
}else{
    echo "Rala";
}
?>


SELECT `mean`,`stream`,`mean_position` FROM `studentdetails` WHERE `class`='4'AND`exam`='22'AND`term`='2'