<?php
include "../core/config.php";
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$query = "SELECT * FROM faculties";
$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

// Process the results into a structured array
$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row; // Append each row to $data
}

// Output the data as JSON
echo json_encode($data); // Output the entire array as JSON

$stmt->close();
$conn->close();
