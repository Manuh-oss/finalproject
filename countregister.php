<?php
include("connection1.php");

if($_SERVER['REQUEST_METHOD'] === 'POST'){

    $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    $response = [];
        
    foreach ($days as $day) {
        $sql = "SELECT admission , COUNT(*) AS presentCount FROM weekone WHERE `$day` = 'present' GROUP BY admission";
        $result = $conn->query($sql);
        
        while($row = $result->fetch_assoc()){
            $admissions = $row['admission'];
    
            if(!isset($response[$admissions])){
                $response[$admissions] = ['present' => 0 , 'permitted' => 0 , 'absent' => 0];
            }
    
            $response[$admissions]['present'] += $row['presentCount'];
        }
    
        $sql = "SELECT admission , COUNT(*) AS presentCount FROM weekone WHERE `$day` = 'permitted' GROUP BY admission";
        $result = $conn->query($sql);
        
        while($row = $result->fetch_assoc()){
            $admissions = $row['admission'];
    
            if(!isset($response[$admissions])){
                $response[$admissions] = ['present' => 0 , 'permitted' => 0 , 'absent' => 0];
            }
    
            $response[$admissions]['permitted'] += $row['presentCount'];
        }
    
        $sql = "SELECT admission , COUNT(*) AS presentCount FROM weekone WHERE `$day` = 'absent' GROUP BY admission";
        $result = $conn->query($sql);
        
        while($row = $result->fetch_assoc()){
            $admissions = $row['admission'];
    
            if(!isset($response[$admissions])){
                $response[$admissions] = ['present' => 0 , 'permitted' => 0 , 'absent' => 0];
            }
    
            $response[$admissions]['absent'] += $row['presentCount'];
        }
    }
    
    echo json_encode($response);
}
?>