<?php
// Include necessary files
require_once 'config.php';
require_once 'auth-helper.php';

// Set up headers
setupCorsHeaders();
setJsonHeaders();

// Require authentication and permission
requirePermission('manage_products');

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
 * Handle GET requests - Retrieve product(s)
 */
function handleGetRequest() {
    global $conn;

    // Check if ID is provided for single product retrieval
    if (isset($_GET['id'])) {
        $id = $_GET['id'];
        $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Product not found']);
            http_response_code(404);
            return;
        }

        $product = $result->fetch_assoc();

        // Process the product data for response
        formatProductResponse($product);

        echo json_encode(['success' => true, 'product' => $product]);
    } else {
        // Get all products with optional filtering and pagination
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;

        // Build query based on filters
        $query = "SELECT * FROM products";
        $countQuery = "SELECT COUNT(*) as total FROM products";

        // Apply filters if provided
        $whereClause = [];
        $params = [];
        $types = "";

        if (isset($_GET['category']) && !empty($_GET['category'])) {
            $whereClause[] = "category = ?";
            $params[] = $_GET['category'];
            $types .= "s";
        }

        if (isset($_GET['subcategory']) && !empty($_GET['subcategory'])) {
            $whereClause[] = "subcategory = ?";
            $params[] = $_GET['subcategory'];
            $types .= "s";
        }

        if (isset($_GET['search']) && !empty($_GET['search'])) {
            $search = '%' . $_GET['search'] . '%';
            $whereClause[] = "(name LIKE ? OR description LIKE ?)";
            $params[] = $search;
            $params[] = $search;
            $types .= "ss";
        }

        if (!empty($whereClause)) {
            $query .= " WHERE " . implode(" AND ", $whereClause);
            $countQuery .= " WHERE " . implode(" AND ", $whereClause);
        }

        // Apply sorting
        $sortField = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'updated_at';
        $sortOrder = isset($_GET['sort_order']) && strtolower($_GET['sort_order']) === 'asc' ? 'ASC' : 'DESC';

        // Validate sort field to prevent SQL injection
        $allowedSortFields = ['id', 'name', 'price', 'category', 'subcategory', 'created_at', 'updated_at'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'updated_at';
        }

        $query .= " ORDER BY {$sortField} {$sortOrder} LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        $types .= "ii";

        // Get total count
        if (!empty($params)) {
            $countStmt = $conn->prepare($countQuery);
            $countStmt->bind_param($types, ...$params);
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

        $products = [];
        while ($product = $result->fetch_assoc()) {
            formatProductResponse($product);
            $products[] = $product;
        }

        $totalPages = ceil($totalCount / $limit);

        echo json_encode([
            'success' => true,
            'products' => $products,
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
 * Handle POST requests - Create product
 */
function handlePostRequest() {
    global $conn;

    // Get request body
    $data = getJsonRequestBody();

    // Validate required fields
    $requiredFields = ['id', 'name', 'price', 'category', 'subcategory'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            echo json_encode(['success' => false, 'message' => "Field '{$field}' is required"]);
            http_response_code(400);
            return;
        }
    }

    // Check if product already exists
    $stmt = $conn->prepare("SELECT id FROM products WHERE id = ?");
    $stmt->bind_param("s", $data['id']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Product with this ID already exists']);
        http_response_code(409);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Prepare data for insertion
    $id = $data['id'];
    $name = $data['name'];
    $description = $data['description'] ?? '';
    $price = $data['price'];
    $category = $data['category'];
    $subcategory = $data['subcategory'];
    $inStock = isset($data['inStock']) ? ($data['inStock'] ? 1 : 0) : 1;

    // Handle images, features, and specifications
    $images = isset($data['images']) ? json_encode($data['images']) : NULL;
    $features = isset($data['features']) ? json_encode($data['features']) : NULL;
    $specifications = isset($data['specifications']) ? json_encode($data['specifications']) : NULL;

    // Insert the product
    $stmt = $conn->prepare("INSERT INTO products (id, name, description, price, images, category, subcategory, features, specifications, inStock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssdsssssi", $id, $name, $description, $price, $images, $category, $subcategory, $features, $specifications, $inStock);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Product created successfully', 'id' => $id]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create product: ' . $stmt->error]);
        http_response_code(500);
    }

    $stmt->close();
}

/**
 * Handle PUT requests - Update product
 */
function handlePutRequest() {
    global $conn;

    // Get request body
    $data = getJsonRequestBody();

    // Validate ID parameter
    if (!isset($data['id']) || empty($data['id'])) {
        echo json_encode(['success' => false, 'message' => 'Product ID is required']);
        http_response_code(400);
        return;
    }

    $id = $data['id'];

    // Check if product exists
    $stmt = $conn->prepare("SELECT id FROM products WHERE id = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Product not found']);
        http_response_code(404);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Build update query
    $updateFields = [];
    $params = [];
    $types = "";

    // Map fields to database columns
    $fieldMapping = [
        'name' => ['name' => 'name', 'type' => 's'],
        'description' => ['name' => 'description', 'type' => 's'],
        'price' => ['name' => 'price', 'type' => 'd'],
        'category' => ['name' => 'category', 'type' => 's'],
        'subcategory' => ['name' => 'subcategory', 'type' => 's'],
        'inStock' => ['name' => 'inStock', 'type' => 'i'],
    ];

    // Special handling for array/object fields
    if (isset($data['images'])) {
        $updateFields[] = "images = ?";
        $params[] = json_encode($data['images']);
        $types .= "s";
    }

    if (isset($data['features'])) {
        $updateFields[] = "features = ?";
        $params[] = json_encode($data['features']);
        $types .= "s";
    }

    if (isset($data['specifications'])) {
        $updateFields[] = "specifications = ?";
        $params[] = json_encode($data['specifications']);
        $types .= "s";
    }

    // Process standard fields
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
    $query = "UPDATE products SET " . implode(", ", $updateFields) . " WHERE id = ?";
    $params[] = $id;
    $types .= "s";

    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update product: ' . $stmt->error]);
        http_response_code(500);
    }

    $stmt->close();
}

/**
 * Handle DELETE requests - Delete product
 */
function handleDeleteRequest() {
    global $conn;

    // Get product ID from URL parameter
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        echo json_encode(['success' => false, 'message' => 'Product ID is required']);
        http_response_code(400);
        return;
    }

    $id = $_GET['id'];

    // Check if product exists
    $stmt = $conn->prepare("SELECT id FROM products WHERE id = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Product not found']);
        http_response_code(404);
        $stmt->close();
        return;
    }
    $stmt->close();

    // Delete the product
    $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt->bind_param("s", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete product: ' . $stmt->error]);
        http_response_code(500);
    }

    $stmt->close();
}

/**
 * Format product data for response
 *
 * @param array &$product The product data to format
 */
function formatProductResponse(&$product) {
    // Convert JSON strings to arrays/objects
    if (isset($product['images']) && !empty($product['images'])) {
        $product['images'] = json_decode($product['images'], true);
    } else {
        $product['images'] = [];
    }

    if (isset($product['features']) && !empty($product['features'])) {
        $product['features'] = json_decode($product['features'], true);
    } else {
        $product['features'] = [];
    }

    if (isset($product['specifications']) && !empty($product['specifications'])) {
        $product['specifications'] = json_decode($product['specifications'], true);
    } else {
        $product['specifications'] = new stdClass();
    }

    // Convert numeric types
    $product['price'] = (float)$product['price'];
    $product['inStock'] = (bool)(int)$product['inStock'];
}
?>
