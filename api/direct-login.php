<?php
// Set headers
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method. Only POST requests are allowed.'
    ]);
    exit;
}

// Get request data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Log input for debugging (in a production environment, you'd remove this)
error_log("Login attempt: " . substr($json, 0, 100));

// Check if data is valid JSON
if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON data: ' . json_last_error_msg(),
        'debug' => ['raw_input' => substr($json, 0, 100)]
    ]);
    exit;
}

// Check credentials
$expected_username = 'admin';
$expected_password = 'admin123';

if (!isset($data['username']) || !isset($data['password'])) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'success' => false,
        'message' => 'Username and password are required',
        'debug' => ['data_received' => $data]
    ]);
    exit;
}

// Direct credential check - hardcoded for reliability
if ($data['username'] === $expected_username && $data['password'] === $expected_password) {
    // Return user object
    $userData = [
        'id' => 1,
        'username' => 'admin',
        'email' => 'admin@example.com',
        'fullName' => 'System Administrator',
        'role' => [
            'id' => 1,
            'name' => 'super_admin',
            'permissions' => [
                'manage_products',
                'manage_customers',
                'manage_warranties',
                'manage_users',
                'manage_roles'
            ]
        ]
    ];

    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => $userData
    ]);
} else {
    http_response_code(401); // Unauthorized
    echo json_encode([
        'success' => false,
        'message' => 'Invalid username or password',
        'debug' => [
            'username_provided' => $data['username'],
            'username_correct' => $data['username'] === $expected_username,
            'password_correct' => $data['password'] === $expected_password
        ]
    ]);
}
?>
