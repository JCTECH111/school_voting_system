<?php
// Include your database connection file
include '../core/config.php';

// Set CORS headers to allow requests from your React app's origin
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

$response = [
    'status' => 'error',
    'message' => '',
    'data' => []
];

// Check if position_id is set and is a valid integer
if (isset($_GET['position_id']) && is_numeric($_GET['position_id'])) {
    $position_id = (int)$_GET['position_id'];

    // Prepare a SQL query to fetch candidates based on the position_id
    $query = "SELECT * FROM candidates WHERE position_id = ?";
    $stmt = $conn->prepare($query);

    if ($stmt) {
        $stmt->bind_param("i", $position_id);
        
        // Execute the statement and fetch results
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $candidates = [];

            while ($row = $result->fetch_assoc()) {
                $candidates[] = $row;
            }

            $response['status'] = 'success';
            $response['message'] = 'Candidates fetched successfully';
            $response['data'] = $candidates;
        } else {
            // Handle query execution error
            http_response_code(500);
            $response['message'] = 'Error executing query';
        }
        
        $stmt->close();
    } else {
        // Handle preparation error
        http_response_code(500);
        $response['message'] = 'Error preparing query';
    }
} else {
    // Invalid or missing position_id parameter
    http_response_code(400);
    $response['message'] = 'Invalid position ID';
}

echo json_encode($response);
$conn->close();
