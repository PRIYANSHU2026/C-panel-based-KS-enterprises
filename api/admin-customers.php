<?php
// Include necessary files
require_once 'config.php';
require_once 'auth-helper.php';

// Set up headers
setupCorsHeaders();
setJsonHeaders();

// Require authentication and permission
requirePermission('manage_customers');

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
 * Handle GET requests - Retrieve customer(s)
 */
function handleGetRequest() {
    global $conn;

    // Check if ID is provided for single customer retrieval
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        $stmt = $conn->prepare("SELECT * FROM customers WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Customer not found']);
            http_response_code(404);
            return;
        }

        $customer = $result->fetch_assoc();
        echo json_encode(['success' => true, 'customer' => $customer]);
    } else {
        // Get all customers with optional filtering and pagination
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;

        // Build query based on filters
        $query = "SELECT * FROM customers";
        $countQuery = "SELECT COUNT(*) as total FROM customers";

        // Apply filters if provided
        $whereClause = [];
        $params = [];
        $types = "";

        if (isset($_GET['search']) && !empty($_GET['search'])) {
            $search = '%' . $_GET['search'] . '%';
            $whereClause[] = "(name LIKE ? OR email LIKE ? OR phone LIKE ?)";
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
            $types .= "sss";
        }

        if (!empty($whereClause)) {
            $query .= " WHERE " . implode(" AND ", $whereClause);
            $countQuery .= " WHERE " . implode(" AND ", $whereClause);
        }

        // Apply sorting
        $sortField = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'name';
        $sortOrder = isset($_GET['sort_order']) && strtolower($_GET['sort_order']) === 'desc' ? 'DESC' : 'ASC';

        // Validate sort field to prevent SQL injection
        $allowedSortFields = ['id', 'name', 'email', 'phone', 'city', 'state', 'created_at', 'updated_at'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'name';
        }

        $query .= " ORDER BY {$sortField} {$sortOrder} LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        $types .= "ii";

        // Get total count
        if (!empty($params) && !empty($types)) {
            $countStmt = $conn->prepare($countQuery);
            $countTypes = substr($types, 0, -2); // Remove 'ii' for limit and offset
            if (!empty($countTypes)) {
                $countParams = array_slice($params, 0, -2); // Remove limit and offset params
                $countStmt->bind_param($countTypes, ...$countParams);
            }
            $countStmt->execute();
            $countResult = $countStmt->get_result();
            $totalCount = $countResult->fetch_assoc()['total'];
            $countStmt->close();
        } else {
            $countResult = $conn->query($countQuery);
            $totalCount = $countResult->fetch_assoc()['total'];
        }

        // Execute the main query
        $stmt = $conn->prepare($query);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();

        $customers = [];
        while ($customer = $result->fetch_assoc()) {
            $customers[] = $customer;
        }

        $totalPages = ceil($totalCount / $limit);

        echo json_encode([
            'success' => true,
            'customers' => $customers,
            'pagination' => [
                'total' => (int)$totalCount,
                'page' => $page,
                'limit' => $limit,
                'totalPages' => $totalPages
            ]
        ]);

        $stmt->close();
    }
}

/**
 * Handle POST requests - Create customer
 */
function handlePostRequest() {
    global $conn;

    // Get request body
    $data = getJsonRequestBody();

    // Validate required fields
    $requiredFields = ['name', 'email', 'phone'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            echo json_encode(['success' => false, 'message' => "Field '{$field}' is required"]);
            http_response_code(400);
            return;
        }
    }

    // Check if customer with this email already exists
    $stmt = $conn->prepare("SELECT id FROM customers WHERE email = ?");
    $stmt->bind_param("s", $data['email']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Customer with this email already exists']);
        http_response_code(409);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Prepare data for insertion
    $name = $data['name'];
    $email = $data['email'];
    $phone = $data['phone'];
    $address = $data['address'] ?? '';
    $city = $data['city'] ?? '';
    $state = $data['state'] ?? '';
    $postalCode = $data['postalCode'] ?? '';
    $notes = $data['notes'] ?? '';

    // Insert the customer
    $stmt = $conn->prepare("INSERT INTO customers (name, email, phone, address, city, state, postal_code, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssss", $name, $email, $phone, $address, $city, $state, $postalCode, $notes);

    if ($stmt->execute()) {
        $id = $conn->insert_id;
        echo json_encode(['success' => true, 'message' => 'Customer created successfully', 'id' => $id]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create customer: ' . $stmt->error]);
        http_response_code(500);
    }

    $stmt->close();
}

/**
 * Handle PUT requests - Update customer
 */
function handlePutRequest() {
    global $conn;

    // Get request body
    $data = getJsonRequestBody();

    // Validate ID parameter
    if (!isset($data['id']) || empty($data['id'])) {
        echo json_encode(['success' => false, 'message' => 'Customer ID is required']);
        http_response_code(400);
        return;
    }

    $id = (int)$data['id'];

    // Check if customer exists
    $stmt = $conn->prepare("SELECT id FROM customers WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Customer not found']);
        http_response_code(404);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Check if email is being changed and already exists
    if (isset($data['email']) && !empty($data['email'])) {
        $stmt = $conn->prepare("SELECT id FROM customers WHERE email = ? AND id != ?");
        $stmt->bind_param("si", $data['email'], $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Another customer with this email already exists']);
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

    // Map fields to database columns
    $fieldMapping = [
        'name' => ['name' => 'name', 'type' => 's'],
        'email' => ['name' => 'email', 'type' => 's'],
        'phone' => ['name' => 'phone', 'type' => 's'],
        'address' => ['name' => 'address', 'type' => 's'],
        'city' => ['name' => 'city', 'type' => 's'],
        'state' => ['name' => 'state', 'type' => 's'],
        'postalCode' => ['name' => 'postal_code', 'type' => 's'],
        'notes' => ['name' => 'notes', 'type' => 's'],
    ];

    // Process fields
    foreach ($fieldMapping as $field => $details) {
        if (isset($data[$field])) {
            $updateFields[] = "{$details['name']} = ?";
            $params[] = $data[$field];
            $types .= $details['type'];
        }
    }

    if (empty($updateFields)) {
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
        http_response_code(400);
        return;
    }

    // Prepare and execute update query
    $query = "UPDATE customers SET " . implode(", ", $updateFields) . " WHERE id = ?";
    $params[] = $id;
    $types .= "i";

    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Customer updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update customer: ' . $stmt->error]);
        http_response_code(500);
    }

    $stmt->close();
}

/**
 * Handle DELETE requests - Delete customer
 */
function handleDeleteRequest() {
    global $conn;

    // Get customer ID from URL parameter
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        echo json_encode(['success' => false, 'message' => 'Customer ID is required']);
        http_response_code(400);
        return;
    }

    $id = (int)$_GET['id'];

    // Check if customer exists
    $stmt = $conn->prepare("SELECT id FROM customers WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Customer not found']);
        http_response_code(404);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Delete the customer
    $stmt = $conn->prepare("DELETE FROM customers WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Customer deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete customer: ' . $stmt->error]);
        http_response_code(500);
    }

    $stmt->close();
}
?>
