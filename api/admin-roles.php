<?php
// Include necessary files
require_once 'config.php';
require_once 'auth-helper.php';

// Set up headers
setupCorsHeaders();
setJsonHeaders();

// Require authentication and permission for managing roles
requirePermission('manage_roles');

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
 * Handle GET requests - Retrieve role(s)
 */
function handleGetRequest() {
    global $conn;

    // Check if ID is provided for single role retrieval
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        $stmt = $conn->prepare("SELECT * FROM roles WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Role not found']);
            http_response_code(404);
            return;
        }

        $role = $result->fetch_assoc();

        // Convert permissions from JSON string to array
        $role['permissions'] = json_decode($role['permissions'], true);

        echo json_encode(['success' => true, 'role' => $role]);
    } else {
        // Get all roles
        $query = "SELECT * FROM roles ORDER BY id";
        $result = $conn->query($query);

        $roles = [];
        while ($role = $result->fetch_assoc()) {
            // Convert permissions from JSON string to array
            $role['permissions'] = json_decode($role['permissions'], true);
            $roles[] = $role;
        }

        echo json_encode(['success' => true, 'roles' => $roles]);
    }
}

/**
 * Handle POST requests - Create role
 */
function handlePostRequest() {
    global $conn;

    // Get request body
    $data = getJsonRequestBody();

    // Validate required fields
    $requiredFields = ['name', 'permissions'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            echo json_encode(['success' => false, 'message' => "Field '{$field}' is required"]);
            http_response_code(400);
            return;
        }
    }

    // Check if role with this name already exists
    $stmt = $conn->prepare("SELECT id FROM roles WHERE name = ?");
    $stmt->bind_param("s", $data['name']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Role with this name already exists']);
        http_response_code(409);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Prepare data for insertion
    $name = $data['name'];
    $description = $data['description'] ?? '';

    // Validate and encode permissions
    if (!is_array($data['permissions'])) {
        echo json_encode(['success' => false, 'message' => 'Permissions must be an array']);
        http_response_code(400);
        return;
    }

    $permissions = json_encode($data['permissions']);

    // Insert the role
    $stmt = $conn->prepare("INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $description, $permissions);

    if ($stmt->execute()) {
        $id = $conn->insert_id;
        echo json_encode(['success' => true, 'message' => 'Role created successfully', 'id' => $id]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create role: ' . $stmt->error]);
        http_response_code(500);
    }

    $stmt->close();
}

/**
 * Handle PUT requests - Update role
 */
function handlePutRequest() {
    global $conn;

    // Get request body
    $data = getJsonRequestBody();

    // Validate ID parameter
    if (!isset($data['id']) || empty($data['id'])) {
        echo json_encode(['success' => false, 'message' => 'Role ID is required']);
        http_response_code(400);
        return;
    }

    $id = (int)$data['id'];

    // Check if role exists
    $stmt = $conn->prepare("SELECT id FROM roles WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Role not found']);
        http_response_code(404);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Check if changing name to an existing name
    if (isset($data['name']) && !empty($data['name'])) {
        $stmt = $conn->prepare("SELECT id FROM roles WHERE name = ? AND id != ?");
        $stmt->bind_param("si", $data['name'], $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Another role with this name already exists']);
            http_response_code(409);
            $stmt->close();
            return;
        }
        $stmt->close();
    }

    // Build update query
    $updateFields = [];
    $params = [];
    $types = "";

    // Handle name
    if (isset($data['name']) && !empty($data['name'])) {
        $updateFields[] = "name = ?";
        $params[] = $data['name'];
        $types .= "s";
    }

    // Handle description
    if (isset($data['description'])) {
        $updateFields[] = "description = ?";
        $params[] = $data['description'];
        $types .= "s";
    }

    // Handle permissions
    if (isset($data['permissions']) && is_array($data['permissions'])) {
        $updateFields[] = "permissions = ?";
        $params[] = json_encode($data['permissions']);
        $types .= "s";
    }

    if (empty($updateFields)) {
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
        http_response_code(400);
        return;
    }

    // Prepare and execute update query
    $query = "UPDATE roles SET " . implode(", ", $updateFields) . " WHERE id = ?";
    $params[] = $id;
    $types .= "i";

    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Role updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update role: ' . $stmt->error]);
        http_response_code(500);
    }

    $stmt->close();
}

/**
 * Handle DELETE requests - Delete role
 */
function handleDeleteRequest() {
    global $conn;

    // Get role ID from URL parameter
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        echo json_encode(['success' => false, 'message' => 'Role ID is required']);
        http_response_code(400);
        return;
    }

    $id = (int)$_GET['id'];

    // Check if role exists
    $stmt = $conn->prepare("SELECT id FROM roles WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Role not found']);
        http_response_code(404);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Check if role is in use
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM users WHERE role_id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    if ($row['count'] > 0) {
        echo json_encode(['success' => false, 'message' => 'Cannot delete role as it is assigned to users']);
        http_response_code(409);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Delete the role
    $stmt = $conn->prepare("DELETE FROM roles WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Role deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete role: ' . $stmt->error]);
        http_response_code(500);
    }

    $stmt->close();
}
?>
