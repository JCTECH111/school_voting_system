<?php
include '../core/config.php';

header("Access-Control-Allow-Origin: http://localhost:5173"); // Your React app's origin
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST and OPTIONS methods
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No content response
    exit; // Exit the script after handling the preflight
}

// Decode JSON data from the request body
$data = json_decode(file_get_contents('php://input'), true);
$user_id = $data['user_id'];
$candidate_id = $data['candidate_id'];
$position_id = $data['position_id'];

// Check if required data is present
if (!$user_id || !$candidate_id || !$position_id) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'Required fields missing']);
    exit;
}

// Check if the user has already voted for this position
$checkQuery = "SELECT 1 FROM votes WHERE user_id = ? AND position_id = ?";
$checkStmt = $conn->prepare($checkQuery);
$checkStmt->bind_param("ii", $user_id, $position_id);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    http_response_code(409); // Conflict
    echo json_encode(['status' => 'error', 'message' => 'You have already voted for this position']);
} else {
    // Insert the vote into the votes table
    $insertQuery = "INSERT INTO votes (user_id, candidate_id, position_id) VALUES (?, ?, ?)";
    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->bind_param("iii", $user_id, $candidate_id, $position_id);

    if ($insertStmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Vote cast successfully']);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['status' => 'error', 'message' => 'Error casting vote: ' . $conn->error]);
    }

    $insertStmt->close();
}

$checkStmt->close();
$conn->close();
