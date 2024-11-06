<?php
include '../core/config.php';

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173"); // Change this to your React app's origin
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow specific headers
header("Access-Control-Allow-Methods: POST"); // Allow specific HTTP methods
header('Content-Type: application/json');

// SQL query to get positions and count of candidates for each position
$query = "
    SELECT p.position_id, p.position_name, p.description, p.created_at, COUNT(c.candidate_id) AS total_candidates
    FROM positions p
    LEFT JOIN candidates c ON p.position_id = c.position_id
    GROUP BY p.position_id
";

$result = $conn->query($query);
$positions = [];

while ($row = $result->fetch_assoc()) {
    $positions[] = [
        'position_id' => $row['position_id'],
        'position_name' => $row['position_name'],
        'position_description' => $row['description'],
        'time' => $row['created_at'],
        'total_candidates' => (int) $row['total_candidates'] // Ensuring count is an integer
    ];
}

echo json_encode($positions);
$conn->close();
