<?php

require 'database.php';

try {
    // connect to the data base
$conn = new mysqli(DB_HOST, DB_USER, DB_pass, DB_NAME);
if(mysqli_errno($conn)){
    die(mysqli_errno($conn));
}
} catch (\Throwable $th) {
    echo "Check Your internet connection";
    
}