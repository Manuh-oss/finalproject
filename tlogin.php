<?php
include("connection.php");
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $conn->real_escape_string($_POST['username']);
    $password = $conn->real_escape_string($_POST['password']);

    $sql = "SELECT * FROM teachers WHERE email = '$username' AND identification = '$password'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();

        //  Set session variable
        $_SESSION['user_id'] = $row['teachers_code']; 
        $_SESSION['id'] = $row['identification']; 

        //  Response to JS
        echo json_encode([
            "message" => "success",
            "type" => true
        ]);

    } else {
        echo json_encode([
            "message" => "wrong credentials please try again",
            "type" => false
        ]);
    }

} else {
    echo "not submitted";
}

$conn->close();
?>
