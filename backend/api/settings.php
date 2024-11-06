<?php
include "../core/config.php";

// Set headers for CORS and JSON content
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle GET request: Fetch current settings
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    fetchSettings($conn);
}

// Handle POST request: Update settings
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    updateSettings($conn);
}

// Close the MySQL connection
$conn->close();


function fetchSettings($conn) {
    $query = "SELECT portal_open, portal_close, show_results FROM settings LIMIT 1";
    $result = $conn->query($query);

    if ($result) {
        $settings = $result->fetch_assoc();
        echo json_encode($settings);
    } else {
        echo json_encode(["error" => "Failed to fetch settings."]);
    }
}


function updateSettings($conn) {
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate and sanitize input data
    $portal_open = $data['portal_open'] ?? '';
    $portal_close = $data['portal_close'] ?? '';
    $show_results = isset($data['show_results']) ? intval($data['show_results']) : 0;

    // Prepare and execute update query
    $stmt = $conn->prepare("UPDATE settings SET portal_open = ?, portal_close = ?, show_results = ? WHERE setting_id = 1");
    $stmt->bind_param("ssi", $portal_open, $portal_close, $show_results);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => $stmt->affected_rows > 0]);
    } else {
        echo json_encode(["error" => "Failed to update settings."]);
    }
}

