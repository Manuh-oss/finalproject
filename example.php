<?php

$students = [];
$students[] = ['monday','tuesday','wednesday','thursday','friday'];

for($i = 0; $i < 5; $i++){
    foreach($students as $student){
        echo "<table>
          <tr>
          <th>day</th>
          <th>lesson1</th>
          <th>lesson2</th>
          <th>lesson3</th>
          <th>lesson4</th>
          <th>lesson5</th>
          </tr>
          <tr>
            <td>$student[$i]</td>
            <td><input type='text'></td>
            <td><input type='text'></td>
            <td><input type='text'></td>
            <td><input type='text'></td>
            <td><input type='text'></td>
          </tr>
        </table>";
    }
}

?>