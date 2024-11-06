<?php
include '../core/config.php';

header("Access-Control-Allow-Origin: http://localhost:5173"); // Your React app's origin
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET"); // Allow GET method
header("Content-Type: application/json");

// Retrieve user_id and position_id from the request
$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
$position_id = isset($_GET['position_id']) ? intval($_GET['position_id']) : null;

// Check if required data is present
if ($user_id === null || $position_id === null) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Required fields missing']);
    exit;
}

// Query to get the candidate IDs that the user has voted for in the specified position
$query = "
    SELECT candidate_id 
    FROM votes 
    WHERE user_id = ? AND position_id = ?
";

$stmt = $conn->prepare($query);
$stmt->bind_param("ii", $user_id, $position_id);
$stmt->execute();
$result = $stmt->get_result();

$votedCandidates = [];
while ($row = $result->fetch_assoc()) {
    $votedCandidates[] = $row['candidate_id']; // Add candidate_id to the array
}

$stmt->close();
$conn->close();

// Return the list of voted candidate IDs
echo json_encode(['votedCandidates' => $votedCandidates]);

