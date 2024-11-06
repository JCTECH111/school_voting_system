<?php
include '../core/config.php'; // Include your database connection settings
header("Access-Control-Allow-Origin: http://localhost:5173"); // Your React app's origin
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS"); // Allow GET and OPTIONS methods
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No content response
    exit; // Exit the script after handling the preflight
}

$candidate_id = $_GET['candidate_id'] ?? null; // Get candidate_id from the query parameter

if (!$candidate_id) {
    echo json_encode(['status' => 'error', 'message' => 'Candidate ID is required']);
    exit;
}

// Fetch candidate data
$query = "SELECT c.candidate_id, c.name, c.bio, c.class_level, c.gender, c.class_level, 
                 f.faculty_name AS faculty, d.department_name AS department, 
                 c.image_url
          FROM candidates c
          JOIN faculties f ON c.faculty_id = f.faculty_id
          JOIN departments d ON c.department_id = d.department_id
          WHERE c.candidate_id = ?";

$stmt = $conn->prepare($query);

if ($stmt) {
    $stmt->bind_param("i", $candidate_id); // Bind the candidate_id parameter
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $candidate = $result->fetch_assoc();
        // Assuming images are stored as a JSON array in the 'images' column
        // if (isset($candidate['images'])) {
        //     $candidate['images'] = json_decode($candidate['images'], true); // Decode images as an associative array
        // }
        echo json_encode(['status' => 'success', 'data' => $candidate]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Candidate not found']);
    }
    
    $stmt->close(); // Close statement
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to prepare the SQL statement']);
}

$conn->close(); // Close the database connection

