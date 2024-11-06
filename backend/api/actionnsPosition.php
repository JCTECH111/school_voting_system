<?php
include "../core/config.php";
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Fetch all positions
if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM positions");
    $positions = [];
    
    while ($row = $result->fetch_assoc()) {
        $positions[] = $row;
    }

    header('Content-Type: application/json');
    echo json_encode($positions);
}

// Create a new position
if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (isset($input['name'])) {
        $name = $conn->real_escape_string($input['name']);
        $description = $conn->real_escape_string($input['description']);
        $sql = "INSERT INTO positions (position_name,description ) VALUES ('$name', '$description')";
        
        if ($conn->query($sql)) {
            echo json_encode(['message' => 'Position created successfully']);
        } else {
            echo json_encode(['message' => 'Error creating position']);
        }
    }
}

// Update a position
// Update a position
if ($method === 'PUT' && isset($_GET['id'])) {
    $id = (int) $_GET['id'];
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (isset($input['name']) && isset($input['description'])) {
        $name = $conn->real_escape_string($input['name']);
        $description = $conn->real_escape_string($input['description']);
        $sql = "UPDATE positions SET position_name = '$name', description = '$description' WHERE position_id = $id"; // Use comma instead of 'and'
        
        if ($conn->query($sql)) {
            echo json_encode(['message' => 'Position updated successfully']);
        } else {
            echo json_encode(['message' => 'Error updating position']);
        }
    }
}


// Delete a position
if ($method === 'DELETE' && isset($_GET['id'])) {
    $id = (int) $_GET['id'];
    $sql = "DELETE FROM positions WHERE position_id = $id";
    
    if ($conn->query($sql)) {
        echo json_encode(['message' => 'Position deleted successfully']);
    } else {
        echo json_encode(['message' => 'Error deleting position']);
    }
}

// Close connection
$conn->close();
