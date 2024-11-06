<?php
include "../core/config.php";  // Replace with your config file path
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $result = $conn->query("SELECT * FROM faculties");
    $faculties = [];
    while ($row = $result->fetch_assoc()) {
        $faculties[] = $row;
    }
    echo json_encode($faculties);
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    if (isset($input['name']) ) {
        $name = $conn->real_escape_string($input['name']);
        $sql = "INSERT INTO faculties (faculty_name) VALUES ('$name')";
        echo $conn->query($sql) ? json_encode(['message' => 'Faculty created successfully']) : json_encode(['message' => 'Error creating faculty']);
    }
}

if ($method === 'PUT' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $input = json_decode(file_get_contents("php://input"), true);
    if (isset($input['name']) ) {
        $name = $conn->real_escape_string($input['name']);
        $sql = "UPDATE faculties SET faculty_name = '$name' WHERE faculty_id = $id";
        echo $conn->query($sql) ? json_encode(['message' => 'Faculty updated successfully']) : json_encode(['message' => 'Error updating faculty']);
    }
}

if ($method === 'DELETE' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $sql = "DELETE FROM faculties WHERE faculty_id = $id";
    echo $conn->query($sql) ? json_encode(['message' => 'Faculty deleted successfully']) : json_encode(['message' => 'Error deleting faculty']);
}

$conn->close();

