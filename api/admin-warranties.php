<?php
// Include necessary files
require_once 'config.php';
require_once 'auth-helper.php';

// Set up headers
setupCorsHeaders();
setJsonHeaders();

// Require authentication and permission
requirePermission('manage_warranties');

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
 * Handle GET requests - Retrieve warranty(s)
 */
function handleGetRequest() {
    global $conn;

    // Check if ID is provided for single warranty retrieval
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];

        // Get detailed warranty info with product and customer details
        $query = "SELECT w.*,
                p.name as product_name, p.category, p.subcategory,
                c.name as customer_name, c.email as customer_email, c.phone as customer_phone
                FROM warranties w
                JOIN products p ON w.product_id = p.id
                JOIN customers c ON w.customer_id = c.id
                WHERE w.id = ?";

        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Warranty not found']);
            http_response_code(404);
            return;
        }

        $warranty = $result->fetch_assoc();

        // Format dates for the response
        $warranty['purchase_date'] = date('Y-m-d', strtotime($warranty['purchase_date']));
        $warranty['expiration_date'] = date('Y-m-d', strtotime($warranty['expiration_date']));

        echo json_encode(['success' => true, 'warranty' => $warranty]);
    } else {
        // Get all warranties with optional filtering and pagination
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;

        // Base query with joins for product and customer info
        $query = "SELECT w.*,
                p.name as product_name, p.category, p.subcategory,
                c.name as customer_name, c.email as customer_email
                FROM warranties w
                JOIN products p ON w.product_id = p.id
                JOIN customers c ON w.customer_id = c.id";

        $countQuery = "SELECT COUNT(*) as total FROM warranties w";

        // Apply filters if provided
        $whereClause = [];
        $params = [];
        $types = "";

        // Filter by product or customer ID if specified
        if (isset($_GET['product_id']) && !empty($_GET['product_id'])) {
            $whereClause[] = "w.product_id = ?";
            $params[] = $_GET['product_id'];
            $types .= "s";

            // Update count query to include the filter
            $countQuery .= " WHERE w.product_id = ?";
        }

        if (isset($_GET['customer_id']) && !empty($_GET['customer_id'])) {
            $whereClause[] = "w.customer_id = ?";
            $params[] = (int)$_GET['customer_id'];
            $types .= "i";

            // Update count query to include the filter
            if (strpos($countQuery, 'WHERE') !== false) {
                $countQuery .= " AND w.customer_id = ?";
            } else {
                $countQuery .= " WHERE w.customer_id = ?";
            }
        }

        // Add search capability
        if (isset($_GET['search']) && !empty($_GET['search'])) {
            $search = '%' . $_GET['search'] . '%';

            // Join to products and customers for search if not already included in where clause
            if (empty($whereClause)) {
                $countQuery .= " JOIN products p ON w.product_id = p.id JOIN customers c ON w.customer_id = c.id";
            }

            $searchWhere = "(p.name LIKE ? OR c.name LIKE ? OR w.serial_number LIKE ?)";

            if (!empty($whereClause)) {
                $whereClause[] = $searchWhere;
            } else {
                $whereClause[] = $searchWhere;
            }

            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
            $types .= "sss";

            // Update count query to include search
            if (strpos($countQuery, 'WHERE') !== false) {
                $countQuery .= " AND " . $searchWhere;
            } else {
                $countQuery .= " WHERE " . $searchWhere;
            }
        }

        // Filter by warranty status (active/expired)
        if (isset($_GET['status']) && in_array($_GET['status'], ['active', 'expired'])) {
            $today = date('Y-m-d');

            if ($_GET['status'] === 'active') {
                $whereClause[] = "w.expiration_date >= ?";
            } else { // expired
                $whereClause[] = "w.expiration_date < ?";
            }

            $params[] = $today;
            $types .= "s";

            // Update count query
            if (strpos($countQuery, 'WHERE') !== false) {
                $countQuery .= $_GET['status'] === 'active' ? " AND w.expiration_date >= ?" : " AND w.expiration_date < ?";
            } else {
                $countQuery .= $_GET['status'] === 'active' ? " WHERE w.expiration_date >= ?" : " WHERE w.expiration_date < ?";
            }
        }

        if (!empty($whereClause)) {
            $query .= " WHERE " . implode(" AND ", $whereClause);
        }

        // Apply sorting
        $sortField = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'expiration_date';
        $sortOrder = isset($_GET['sort_order']) && strtolower($_GET['sort_order']) === 'asc' ? 'ASC' : 'DESC';

        // Validate sort field to prevent SQL injection
        $allowedSortFields = [
            'id', 'purchase_date', 'expiration_date', 'product_name', 'customer_name', 'created_at'
        ];

        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'expiration_date';
        }

        // Map sort fields to actual table columns
        $sortFieldMapping = [
            'product_name' => 'p.name',
            'customer_name' => 'c.name',
            'id' => 'w.id',
            'purchase_date' => 'w.purchase_date',
            'expiration_date' => 'w.expiration_date',
            'created_at' => 'w.created_at'
        ];

        $mappedSortField = $sortFieldMapping[$sortField] ?? 'w.expiration_date';

        $query .= " ORDER BY {$mappedSortField} {$sortOrder} LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        $types .= "ii";

        // Get total count
        $countStmt = $conn->prepare($countQuery);
        if (!empty($params)) {
            // Exclude limit and offset for count query
            $countParams = array_slice($params, 0, -2);
            $countTypes = substr($types, 0, -2);

            if (!empty($countParams)) {
                $countStmt->bind_param($countTypes, ...$countParams);
            }
        }

        $countStmt->execute();
        $countResult = $countStmt->get_result();
        $totalCount = $countResult->fetch_assoc()['total'];
        $countStmt->close();

        // Execute the main query
        $stmt = $conn->prepare($query);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();

        $warranties = [];
        while ($warranty = $result->fetch_assoc()) {
            // Format dates for each record
            $warranty['purchase_date'] = date('Y-m-d', strtotime($warranty['purchase_date']));
            $warranty['expiration_date'] = date('Y-m-d', strtotime($warranty['expiration_date']));

            $warranties[] = $warranty;
        }

        $totalPages = ceil($totalCount / $limit);

        echo json_encode([
            'success' => true,
            'warranties' => $warranties,
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
 * Handle POST requests - Create warranty (map product to customer)
 */
function handlePostRequest() {
    global $conn;

    // Get request body
    $data = getJsonRequestBody();

    // Validate required fields
    $requiredFields = ['productId', 'customerId', 'purchaseDate', 'expirationDate'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            echo json_encode(['success' => false, 'message' => "Field '{$field}' is required"]);
            http_response_code(400);
            return;
        }
    }

    // Verify product exists
    $stmt = $conn->prepare("SELECT id FROM products WHERE id = ?");
    $stmt->bind_param("s", $data['productId']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Product not found']);
        http_response_code(404);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Verify customer exists
    $stmt = $conn->prepare("SELECT id FROM customers WHERE id = ?");
    $stmt->bind_param("i", $data['customerId']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Customer not found']);
        http_response_code(404);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Prepare data for insertion
    $productId = $data['productId'];
    $customerId = (int)$data['customerId'];
    $serialNumber = $data['serialNumber'] ?? '';
    $purchaseDate = $data['purchaseDate'];
    $expirationDate = $data['expirationDate'];
    $notes = $data['notes'] ?? '';

    // Insert the warranty record
    $stmt = $conn->prepare("INSERT INTO warranties (product_id, customer_id, serial_number, purchase_date, expiration_date, notes) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sissss", $productId, $customerId, $serialNumber, $purchaseDate, $expirationDate, $notes);

    if ($stmt->execute()) {
        $id = $conn->insert_id;
        echo json_encode(['success' => true, 'message' => 'Warranty record created successfully', 'id' => $id]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create warranty record: ' . $stmt->error]);
        http_response_code(500);
    }

    $stmt->close();
}

/**
 * Handle PUT requests - Update warranty
 */
function handlePutRequest() {
    global $conn;

    // Get request body
    $data = getJsonRequestBody();

    // Validate ID parameter
    if (!isset($data['id']) || empty($data['id'])) {
        echo json_encode(['success' => false, 'message' => 'Warranty ID is required']);
        http_response_code(400);
        return;
    }

    $id = (int)$data['id'];

    // Check if warranty exists
    $stmt = $conn->prepare("SELECT id FROM warranties WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Warranty not found']);
        http_response_code(404);
        $stmt->close();
        return;
    }
    $stmt->close();

    // If changing product, verify the new product exists
    if (isset($data['productId']) && !empty($data['productId'])) {
        $stmt = $conn->prepare("SELECT id FROM products WHERE id = ?");
        $stmt->bind_param("s", $data['productId']);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Product not found']);
            http_response_code(404);
            $stmt->close();
            return;
        }
        $stmt->close();
    }

    // If changing customer, verify the new customer exists
    if (isset($data['customerId']) && !empty($data['customerId'])) {
        $stmt = $conn->prepare("SELECT id FROM customers WHERE id = ?");
        $stmt->bind_param("i", $data['customerId']);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Customer not found']);
            http_response_code(404);
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
        'productId' => ['name' => 'product_id', 'type' => 's'],
        'customerId' => ['name' => 'customer_id', 'type' => 'i'],
        'serialNumber' => ['name' => 'serial_number', 'type' => 's'],
        'purchaseDate' => ['name' => 'purchase_date', 'type' => 's'],
        'expirationDate' => ['name' => 'expiration_date', 'type' => 's'],
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
    $query = "UPDATE warranties SET " . implode(", ", $updateFields) . " WHERE id = ?";
    $params[] = $id;
    $types .= "i";

    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Warranty updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update warranty: ' . $stmt->error]);
        http_response_code(500);
    }

    $stmt->close();
}

/**
 * Handle DELETE requests - Delete warranty
 */
function handleDeleteRequest() {
    global $conn;

    // Get warranty ID from URL parameter
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        echo json_encode(['success' => false, 'message' => 'Warranty ID is required']);
        http_response_code(400);
        return;
    }

    $id = (int)$_GET['id'];

    // Check if warranty exists
    $stmt = $conn->prepare("SELECT id FROM warranties WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Warranty not found']);
        http_response_code(404);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Delete the warranty
    $stmt = $conn->prepare("DELETE FROM warranties WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Warranty deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete warranty: ' . $stmt->error]);
        http_response_code(500);
    }

    $stmt->close();
}
?>
