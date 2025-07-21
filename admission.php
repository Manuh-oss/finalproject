<?php
include("connection2.php");

$sql = "select * FROM main";
$result = $conn->query($sql);

$admissions = [];

while($row = $result->fetch_assoc()){
    $admissions[] = $row['admission'];
}

foreach($admissions as $admission){
    echo $admission;

    $file = 'admission.json';

    file_put_contents($file , json_encode($admissions , JSON_PRETTY_PRINT));
}
?>