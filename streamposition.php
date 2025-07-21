<?php
include("connection2.php");

$subjects = 'mean';
$subject = 'Totals';
$classQuery = "SELECT DISTINCT stream FROM studentdetails";
$classresult = $conn->query($classQuery);

while ($classrow = $classresult->fetch_assoc()) {
    $class = $classrow['stream'];

    $sql = "SELECT Student_id, firstname, admission, mean AS marks
            FROM studentdetails
            WHERE stream = '$class' AND mean IS NOT NULL
            ORDER BY marks DESC, firstname ASC";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $students = [];
        while ($row = $result->fetch_assoc()) {
            $students[] = $row;
        }

        // Assign positions
        $Currentrank = 1;
        $Currentposition = 1;
        $previousposition = null;

        foreach ($students as &$student) {
            if ($student['marks'] === $previousposition) {
                $student['position'] = $Currentrank; // same as before
            } else {
                $Currentrank = $Currentposition;
                $student['position'] = $Currentrank;
            }

            // Update database
            $positioncolumn = "{$subject}_position";
            $Student_id = $student['Student_id'];
            $position = $student['position'];
            $updatesql = "UPDATE studentdetails 
                          SET $positioncolumn = $position 
                          WHERE Student_id = $Student_id";

            $conn->query($updatesql);

            $previousposition = $student['marks'];
            $Currentposition++;
        }
    } else {
        echo "No students found for $subject in stream $class.<br>";
    }
}

// Redirect after ALL streams are processed
header("Location: position.php");
exit;


 
