<?php
// Include your database connection file
include '../core/config.php'; // Adjust this to your actual DB connection file

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173"); // Change this to your React app's origin
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow specific headers
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow specific HTTP methods

// Handle OPTIONS request for preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content
    exit();
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate input
    if (isset($data['reg_no']) && isset($data['password'])) {
        $reg_no = $data['reg_no'];
        $password = $data['password'];

        // Step 1: Check if the portal is open
        $portalQuery = "SELECT portal_open, portal_close FROM settings LIMIT 1";
        $portalResult = $conn->query($portalQuery);
        if ($portalResult->num_rows > 0) {
            $portal = $portalResult->fetch_assoc();
            $portalOpen = strtotime($portal['portal_open']);
            $portalClose = strtotime($portal['portal_close']);
            $currentTime = time();

            // Check if the current time is outside the portal open and close times
            if ($currentTime < $portalOpen || $currentTime > $portalClose) {
                // http_response_code(403); // Forbidden
                echo json_encode(['error' => 'The portal is currently closed.']);
                $conn->close();
                exit();
            }
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(['error' => 'Failed to retrieve portal settings.']);
            $conn->close();
            exit();
        }

        // Step 2: Proceed with the sign-in process if the portal is open
        $stmt = $conn->prepare("SELECT * FROM users WHERE reg_no = ?");
        $stmt->bind_param("s", $reg_no);
        $stmt->execute();
        $result = $stmt->get_result();

        // Check if user exists
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            // Verify the password (plain text comparison since no hashing is used)
            if ($password === $user['password']) {  // Direct comparison for plain text
                echo json_encode(['message' => 'Sign In Successful', 'user' => $user]);
            } else {
                // Invalid password
                http_response_code(401); // Unauthorized
                echo json_encode(['error' => 'Invalid credentials']);
            }
        } else {
            // User does not exist
            http_response_code(401); // Unauthorized
            echo json_encode(['error' => 'Invalid credentials']);
        }

        $stmt->close();
    } else {
        // Invalid request
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'Please provide registration number and password']);
    }
} else {
    // Method not allowed
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method not allowed']);
}

$conn->close(); // Close the database connection
