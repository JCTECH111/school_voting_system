<?php
include "../core/config.php";
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

// Directory to save uploaded images
$imageDir =  "../CandidatesImages/";

switch ($method) {
    case 'GET':
        $result = $conn->query("SELECT 
                                    p.position_name AS position_name, 
                                    c.candidate_id AS candidate_id, 
                                    c.name AS candidate_name, 
                                    c.class_level AS candidate_level, 
                                    c.image_url AS candidate_image
                                FROM positions p
                                INNER JOIN candidates c ON p.position_id = c.position_id
                                ORDER BY p.position_name ASC");

        $candidates = [];
        while ($row = $result->fetch_assoc()) {
            $candidates[] = $row;
        }
        echo json_encode($candidates);
        break;
    
        case 'POST':
            if (isset($_POST['_method']) && $_POST['_method'] === 'PUT' && isset($_GET['id'])) {
                // Update operation
                $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
                if (!$id) {
                    echo json_encode(['status' => 'error', 'message' => 'Invalid ID.']);
                    exit();
                }
                
                // Extract fields and validate
                $name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8') : '';
                $bio = isset($_POST['bio']) ? htmlspecialchars(trim($_POST['bio']), ENT_QUOTES, 'UTF-8') : '';
                $position_id = isset($_POST['position_id']) ? filter_var($_POST['position_id'], FILTER_VALIDATE_INT) : null;
                $gender = isset($_POST['gender']) ? htmlspecialchars(trim($_POST['gender']), ENT_QUOTES, 'UTF-8') : '';
                $faculty_id = isset($_POST['faculty']) ? filter_var($_POST['faculty'], FILTER_VALIDATE_INT) : null;
                $class_level = isset($_POST['class_level']) ? htmlspecialchars(trim($_POST['class_level']), ENT_QUOTES, 'UTF-8') : '';
                $department_id = isset($_POST['department']) ? filter_var($_POST['department'], FILTER_VALIDATE_INT) : null;
        
                // Handle image upload
                $image_url = '';
                if (isset($_FILES['image_url']) && $_FILES['image_url']['error'] === UPLOAD_ERR_OK) {
                    $imageTmpPath = $_FILES['image_url']['tmp_name'];
                    $imageName = basename($_FILES['image_url']['name']);
                    $imageExtension = pathinfo($imageName, PATHINFO_EXTENSION);
                    $imageFileName = uniqid('img_', true) . '.' . $imageExtension;
                    $imageFilePath = $imageDir . $imageFileName;
        
                    if (move_uploaded_file($imageTmpPath, $imageFilePath)) {
                        $image_url = $imageFilePath;
                    } else {
                        echo json_encode(['status' => 'error', 'message' => 'Failed to upload image.']);
                        exit();
                    }
                } else {
                    // Keep existing image if no new image is uploaded
                    $stmt = $conn->prepare("SELECT image_url FROM candidates WHERE candidate_id = ?");
                    $stmt->bind_param("i", $id);
                    $stmt->execute();
                    $stmt->bind_result($existingImageUrl);
                    $stmt->fetch();
                    $stmt->close();
        
                    $image_url = $existingImageUrl;
                }
        
                // Update record in the database
                $stmt = $conn->prepare("UPDATE candidates 
                                        SET position_id = ?, name = ?, bio = ?, image_url = ?, class_level = ?, gender = ?, faculty_id = ?, department_id = ? 
                                        WHERE candidate_id = ?");
                $stmt->bind_param("isssssiii", $position_id, $name, $bio, $image_url, $class_level, $gender, $faculty_id, $department_id, $id);
                $stmt->execute();
                echo json_encode(['success' => $stmt->affected_rows > 0]);
            } else {
                // Create operation
                $name = isset($_POST['name']) ? htmlspecialchars(trim($_POST['name']), ENT_QUOTES, 'UTF-8') : '';
                $bio = isset($_POST['bio']) ? htmlspecialchars(trim($_POST['bio']), ENT_QUOTES, 'UTF-8') : '';
                $position_id = isset($_POST['position_id']) ? filter_var($_POST['position_id'], FILTER_VALIDATE_INT) : null;
                $gender = isset($_POST['gender']) ? htmlspecialchars(trim($_POST['gender']), ENT_QUOTES, 'UTF-8') : '';
                $faculty_id = isset($_POST['faculty']) ? filter_var($_POST['faculty'], FILTER_VALIDATE_INT) : null;
                $class_level = isset($_POST['class_level']) ? htmlspecialchars(trim($_POST['class_level']), ENT_QUOTES, 'UTF-8') : '';
                $department_id = isset($_POST['department']) ? filter_var($_POST['department'], FILTER_VALIDATE_INT) : null;
        
                if (empty($name) || !$position_id || !$faculty_id || !$department_id) {
                    echo json_encode(['status' => 'error', 'message' => 'Required fields are missing or invalid.']);
                    exit();
                }
        
                $image_url = '';
                if (isset($_FILES['image_url']) && $_FILES['image_url']['error'] === UPLOAD_ERR_OK) {
                    $imageTmpPath = $_FILES['image_url']['tmp_name'];
                    $imageName = basename($_FILES['image_url']['name']);
                    $imageExtension = pathinfo($imageName, PATHINFO_EXTENSION);
                    $imageFileName = uniqid('img_', true) . '.' . $imageExtension;
                    $imageFilePath = $imageDir . $imageFileName;
        
                    if (move_uploaded_file($imageTmpPath, $imageFilePath)) {
                        $image_url = $imageFilePath;
                    } else {
                        echo json_encode(['status' => 'error', 'message' => 'Failed to upload image.']);
                        exit();
                    }
                }
        
                $stmt = $conn->prepare("INSERT INTO candidates (position_id, name, bio, image_url, class_level, gender, faculty_id, department_id) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("isssssii", $position_id, $name, $bio, $image_url, $class_level, $gender, $faculty_id, $department_id);
                $stmt->execute();
                echo json_encode(['success' => $stmt->affected_rows > 0]);
            }
            break;
        

    case 'DELETE':
        if ($id) {
            $stmt = $conn->prepare("DELETE FROM candidates WHERE candidate_id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            echo json_encode(['success' => $stmt->affected_rows > 0]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No candidate ID provided for deletion.']);
        }
        break;
}

$conn->close();

