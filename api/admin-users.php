<?php
// Include necessary files
require_once 'config.php';
require_once 'auth-helper.php';

// Set up headers
setupCorsHeaders();
setJsonHeaders();

// Require authentication and permission for managing users
requirePermission('manage_users');

// Handle request based on method
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetRequest();
        break;
    case 'POST':
        handlePostRequest();
        break;
    case 'PUT':
        handlePutRequest();
        break;
    case 'DELETE':
        handleDeleteRequest();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        http_response_code(405);
        break;
}

/**
 * Handle GET requests - Retrieve user(s)
 */
function handleGetRequest() {
    global $conn;

    // Check if ID is provided for single user retrieval
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];

        // Get user with role information
        $query = "SELECT u.id, u.username, u.email, u.full_name, u.role_id, u.created_at, u.updated_at,
                 r.name as role_name, r.permissions
                 FROM users u
                 JOIN roles r ON u.role_id = r.id
                 WHERE u.id = ?";

        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'User not found']);
            http_response_code(404);
            return;
        }

        $user = $result->fetch_assoc();

        // Format user for response (remove password, add role object)
        formatUserResponse($user);

        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        // Get all users with role information
        $query = "SELECT u.id, u.username, u.email, u.full_name, u.role_id, u.created_at, u.updated_at,
                 r.name as role_name, r.permissions
                 FROM users u
                 JOIN roles r ON u.role_id = r.id
                 ORDER BY u.id";

        $result = $conn->query($query);

        $users = [];
        while ($user = $result->fetch_assoc()) {
            formatUserResponse($user);
            $users[] = $user;
        }

        echo json_encode(['success' => true, 'users' => $users]);
    }
}

/**
 * Handle POST requests - Create user
 */
function handlePostRequest() {
    global $conn;

    // Get request body
    $data = getJsonRequestBody();

    // Validate required fields
    $requiredFields = ['username', 'password', 'email', 'fullName', 'roleId'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            echo json_encode(['success' => false, 'message' => "Field '{$field}' is required"]);
            http_response_code(400);
            return;
        }
    }

    // Check if username already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->bind_param("s", $data['username']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Username already exists']);
        http_response_code(409);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $data['email']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        http_response_code(409);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Verify role exists
    $roleId = (int)$data['roleId'];
    $stmt = $conn->prepare("SELECT id FROM roles WHERE id = ?");
    $stmt->bind_param("i", $roleId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Role not found']);
        http_response_code(404);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Prepare data for insertion
    $username = $data['username'];
    $email = $data['email'];
    $fullName = $data['fullName'];

    // Hash the password
    $password = password_hash($data['password'], PASSWORD_DEFAULT);

    // Insert the user
    $stmt = $conn->prepare("INSERT INTO users (username, password, email, full_name, role_id) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $username, $password, $email, $fullName, $roleId);

    if ($stmt->execute()) {
        $id = $conn->insert_id;
        echo json_encode(['success' => true, 'message' => 'User created successfully', 'id' => $id]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create user: ' . $stmt->error]);
        http_response_code(500);
    }

    $stmt->close();
}

/**
 * Handle PUT requests - Update user
 */
function handlePutRequest() {
    global $conn;

    // Get request body
    $data = getJsonRequestBody();

    // Validate ID parameter
    if (!isset($data['id']) || empty($data['id'])) {
        echo json_encode(['success' => false, 'message' => 'User ID is required']);
        http_response_code(400);
        return;
    }

    $id = (int)$data['id'];

    // Check if user exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        http_response_code(404);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Build update query
    $updateFields = [];
    $params = [];
    $types = "";

    // Check for username uniqueness if being updated
    if (isset($data['username']) && !empty($data['username'])) {
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
        $stmt->bind_param("si", $data['username'], $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Username already exists']);
            http_response_code(409);
            $stmt->close();
            return;
        }
        $stmt->close();

        $updateFields[] = "username = ?";
        $params[] = $data['username'];
        $types .= "s";
    }

    // Check for email uniqueness if being updated
    if (isset($data['email']) && !empty($data['email'])) {
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $stmt->bind_param("si", $data['email'], $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Email already exists']);
            http_response_code(409);
            $stmt->close();
            return;
        }
        $stmt->close();

        $updateFields[] = "email = ?";
        $params[] = $data['email'];
        $types .= "s";
    }

    // Update full name if provided
    if (isset($data['fullName']) && !empty($data['fullName'])) {
        $updateFields[] = "full_name = ?";
        $params[] = $data['fullName'];
        $types .= "s";
    }

    // Update password if provided
    if (isset($data['password']) && !empty($data['password'])) {
        $updateFields[] = "password = ?";
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        $params[] = $hashedPassword;
        $types .= "s";
    }

    // Update role if provided
    if (isset($data['roleId']) && !empty($data['roleId'])) {
        $roleId = (int)$data['roleId'];

        // Verify role exists
        $stmt = $conn->prepare("SELECT id FROM roles WHERE id = ?");
        $stmt->bind_param("i", $roleId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Role not found']);
            http_response_code(404);
            $stmt->close();
            return;
        }
        $stmt->close();

        $updateFields[] = "role_id = ?";
        $params[] = $roleId;
        $types .= "i";
    }

    if (empty($updateFields)) {
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
        http_response_code(400);
        return;
    }

    // Prepare and execute update query
    $query = "UPDATE users SET " . implode(", ", $updateFields) . " WHERE id = ?";
    $params[] = $id;
    $types .= "i";

    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update user: ' . $stmt->error]);
        http_response_code(500);
    }

    $stmt->close();
}

/**
 * Handle DELETE requests - Delete user
 */
function handleDeleteRequest() {
    global $conn;

    // Get user ID from URL parameter
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        echo json_encode(['success' => false, 'message' => 'User ID is required']);
        http_response_code(400);
        return;
    }

    $id = (int)$_GET['id'];

    // Check if user exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        http_response_code(404);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Check if this is the last super admin
    $currentUser = $conn->prepare("SELECT role_id FROM users WHERE id = ?");
    $currentUser->bind_param("i", $id);
    $currentUser->execute();
    $currentUserResult = $currentUser->get_result();
    $currentUserData = $currentUserResult->fetch_assoc();
    $currentUser->close();

    // If user is super admin (role_id = 1), make sure they're not the last one
    if ($currentUserData['role_id'] == 1) {
        $superAdminCount = $conn->query("SELECT COUNT(*) as count FROM users WHERE role_id = 1");
        $count = $superAdminCount->fetch_assoc()['count'];

        if ($count <= 1) {
            echo json_encode(['success' => false, 'message' => 'Cannot delete the last super admin user']);
            http_response_code(409);
            return;
        }
    }

    // Prevent deleting yourself
    if ($id == getCurrentUserId()) {
        echo json_encode(['success' => false, 'message' => 'Cannot delete your own account']);
        http_response_code(409);
        return;
    }

    // Delete the user
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete user: ' . $stmt->error]);
        http_response_code(500);
    }

    $stmt->close();
}

/**
 * Format user data for response
 *
 * @param array &$user The user data to format
 */
function formatUserResponse(&$user) {
    // Remove password from the response
    unset($user['password']);

    // Convert permissions from JSON string to array
    if (isset($user['permissions'])) {
        $user['permissions'] = json_decode($user['permissions'], true);
    }

    // Create a nested role object
    $user['role'] = [
        'id' => $user['role_id'],
        'name' => $user['role_name'] ?? null,
        'permissions' => $user['permissions'] ?? []
    ];

    // Clean up redundant fields
    unset($user['role_name']);
    unset($user['permissions']);
}
?>
