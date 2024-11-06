<?php
include "../core/config.php";
header("Access-Control-Allow-Origin:http://localhost:5173");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");



$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == 'GET') {
    $query = "SELECT d.department_id, d.department_name AS department_name, f.faculty_id, f.faculty_name
              FROM departments AS d
              INNER JOIN faculties AS f ON d.faculty_id = f.faculty_id";
              
    $result = $conn->query($query);
    $departments = [];
    
    while ($row = $result->fetch_assoc()) {
        $departments[] = $row;
    }
    
    echo json_encode($departments);
}


elseif ($requestMethod == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $name = filter_var($data['name'], FILTER_SANITIZE_SPECIAL_CHARS);
    $faculty_id = filter_var($data['faculty_id'], FILTER_VALIDATE_INT);

    // Check if faculty_id exists in faculties table
    $facultyCheckStmt = $conn->prepare("SELECT faculty_id FROM faculties WHERE faculty_id = ?");
    $facultyCheckStmt->bind_param("i", $faculty_id);
    $facultyCheckStmt->execute();
    $facultyCheckStmt->store_result();

    if ($facultyCheckStmt->num_rows > 0) {
        // Proceed with insert if faculty_id exists
        $stmt = $conn->prepare("INSERT INTO departments (department_name, faculty_id) VALUES (?, ?)");
        $stmt->bind_param("si", $name, $faculty_id);
        
        if ($stmt->execute()) {
            echo json_encode(["message" => "Department added successfully"]);
        } else {
            echo json_encode(["error" => "Error adding department"]);
        }
    } else {
        echo json_encode(["error" => "Invalid faculty_id"]);
    }
}


elseif ($requestMethod == 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
    $name = filter_var($data['name'], FILTER_SANITIZE_SPECIAL_CHARS);
    $foculty_id = filter_var($data['faculty_id'], FILTER_VALIDATE_INT);
    $stmt = $conn->prepare("UPDATE departments SET department_name = ?, faculty_id=? WHERE department_id = ?");
    $stmt->bind_param("sii", $name, $foculty_id, $id);
    $stmt->execute();
    echo json_encode(["message" => "Department updated successfully"]);
}

elseif ($requestMethod == 'DELETE') {
    $id = $_GET['id'];
    $stmt = $conn->prepare("DELETE FROM departments WHERE department_id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    echo json_encode(["message" => "Department deleted successfully"]);
}

$conn->close();

