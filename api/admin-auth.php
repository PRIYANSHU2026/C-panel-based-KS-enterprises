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

// Include database configuration
require_once 'config.php';

// Start the session
session_start();

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get JSON data
$data = json_decode(file_get_contents('php://input'), true);

// Validate data
if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Username and password are required']);
    exit;
}

$username = $data['username'];
$password = $data['password'];

// Prepare the query
$stmt = $conn->prepare("SELECT u.id, u.username, u.password, u.email, u.full_name, u.role_id, r.name as role_name, r.permissions
                       FROM users u
                       JOIN roles r ON u.role_id = r.id
                       WHERE u.username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Verify password using MD5 (simple approach for compatibility)
    $hashed_password = md5($password);

    if ($hashed_password === $user['password']) {
        // Create session data
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role_id'] = $user['role_id'];
        $_SESSION['role_name'] = $user['role_name'];
        $_SESSION['permissions'] = json_decode($user['permissions'], true);
        $_SESSION['logged_in'] = true;

        // Create response data
        $userData = [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'fullName' => $user['full_name'],
            'role' => [
                'id' => $user['role_id'],
                'name' => $user['role_name'],
                'permissions' => json_decode($user['permissions'], true)
            ]
        ];

        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => $userData,
        ]);
        exit;
    }
}

echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
$stmt->close();
?>
