<?php
$servername = "localhost";
$username = "root";
$password = "";
$db_name = "student";

$conn = new mysqli($servername,$username,$password,$db_name, 3306);

if($conn->error){
    die("connection Failed").$conn->error;
}
?>