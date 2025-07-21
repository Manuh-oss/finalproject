<?php
session_start();

header('Content-Type: application/json');

$response = [];

if(isset($_SESSION['admission'])){
    $response = [
        "code" => $_SESSION['admission'],
        "class" => $_SESSION['class'],
        "stream" => $_SESSION['stream'],
        "from" => $_SESSION['from']
    ];
    echo json_encode($response);
}else{
    echo json_encode([]);
}