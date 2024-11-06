<?php
include "../core/config.php";
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$faculty_id = isset($_GET['faculty_id']) ? $_GET['faculty_id'] : '';

if ($faculty_id) {
    $query = "SELECT * FROM departments WHERE faculty_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $faculty_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $departments = [];
    while ($row = $result->fetch_assoc()) {
        $departments[] = $row;
    }

    echo json_encode($departments);

    $stmt->close();
}
$conn->close();
