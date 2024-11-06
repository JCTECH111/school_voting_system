<?php
include "../core/config.php";
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Queries to count the total records in each table
$queries = [
    "candidates" => "SELECT COUNT(*) as total FROM candidates",
    "votes" => "SELECT COUNT(*) as total FROM votes",
    "faculty" => "SELECT COUNT(*) as total FROM faculties",
    "department" => "SELECT COUNT(*) as total FROM departments",
    "position" => "SELECT COUNT(*) as total FROM positions",
    "users" => "SELECT COUNT(*) as total FROM users",
];

$counts = [];
foreach ($queries as $key => $query) {
    $result = $conn->query($query);
    if ($result) {
        $row = $result->fetch_assoc();
        $counts[$key] = $row['total'];
    } else {
        $counts[$key] = 0;  // In case of error, set count to 0
    }
}

// Close connection
$conn->close();

echo json_encode($counts);

