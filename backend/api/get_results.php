<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); // Allow access from your React app
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow specific headers
header("Access-Control-Allow-Methods: GET"); // Use GET since we're fetching data
header("Content-Type: application/json");

include '../core/config.php'; // Ensure this path is correct for your config

// SQL query to retrieve all positions, candidates, and vote counts
$query = "SELECT 
            p.position_name, 
            c.candidate_id, 
            c.name, 
            c.class_level, 
            c.image_url, 
            COUNT(v.vote_id) as votes
            FROM positions p
            JOIN candidates c ON p.position_id = c.position_id
            LEFT JOIN votes v ON c.candidate_id = v.candidate_id
            GROUP BY c.candidate_id 
            ORDER BY p.position_name, votes DESC";

$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

// Process the results into a structured array
$data = [];
while ($row = $result->fetch_assoc()) {
    $positionName = $row['position_name'];
    if (!isset($data[$positionName])) {
        $data[$positionName] = [
            'position_name' => $positionName,
            'candidates' => [],
        ];
    }
    $data[$positionName]['candidates'][] = [
        'id' => $row['candidate_id'],
        'name' => $row['name'],
        'class_level' => $row['class_level'],
        'image_url' => $row['image_url'],
        'votes' => (int)$row['votes'],
    ];
}

// Output the data as JSON
echo json_encode(array_values($data));

$stmt->close();
$conn->close();
