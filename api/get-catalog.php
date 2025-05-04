<?php
// Include database configuration
require_once 'config.php';

// Set headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Function to get all products from the database
function getAllProducts() {
    global $conn;

    $products = [];
    $result = $conn->query("SELECT * FROM products");

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Convert JSON strings back to arrays
            $row['images'] = json_decode($row['images'], true);
            $row['features'] = json_decode($row['features'], true);
            $row['specifications'] = json_decode($row['specifications'], true);
            $row['inStock'] = (bool) $row['inStock'];

            $products[] = $row;
        }
    }

    return $products;
}

// Function to get a product by ID
function getProductById($id) {
    global $conn;

    $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->bind_param("s", $id);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        // Convert JSON strings back to arrays
        $row['images'] = json_decode($row['images'], true);
        $row['features'] = json_decode($row['features'], true);
        $row['specifications'] = json_decode($row['specifications'], true);
        $row['inStock'] = (bool) $row['inStock'];

        return $row;
    }

    return null;
}

// Function to get products by category
function getProductsByCategory($category) {
    global $conn;

    $products = [];
    $stmt = $conn->prepare("SELECT * FROM products WHERE category = ?");
    $stmt->bind_param("s", $category);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Convert JSON strings back to arrays
            $row['images'] = json_decode($row['images'], true);
            $row['features'] = json_decode($row['features'], true);
            $row['specifications'] = json_decode($row['specifications'], true);
            $row['inStock'] = (bool) $row['inStock'];

            $products[] = $row;
        }
    }

    return $products;
}

// Function to get products by subcategory
function getProductsBySubcategory($subcategory) {
    global $conn;

    $products = [];
    $stmt = $conn->prepare("SELECT * FROM products WHERE subcategory = ?");
    $stmt->bind_param("s", $subcategory);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Convert JSON strings back to arrays
            $row['images'] = json_decode($row['images'], true);
            $row['features'] = json_decode($row['features'], true);
            $row['specifications'] = json_decode($row['specifications'], true);
            $row['inStock'] = (bool) $row['inStock'];

            $products[] = $row;
        }
    }

    return $products;
}

// Check if the request is a GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get query parameters
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    $subcategory = isset($_GET['subcategory']) ? $_GET['subcategory'] : null;

    // Return the appropriate data based on the parameters
    if ($id) {
        $product = getProductById($id);

        if ($product) {
            echo json_encode([
                "success" => true,
                "product" => $product
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Product not found."
            ]);
        }
    } elseif ($category) {
        $products = getProductsByCategory($category);

        echo json_encode([
            "success" => true,
            "products" => $products
        ]);
    } elseif ($subcategory) {
        $products = getProductsBySubcategory($subcategory);

        echo json_encode([
            "success" => true,
            "products" => $products
        ]);
    } else {
        // No specific parameter, return all products
        $products = getAllProducts();

        echo json_encode([
            "success" => true,
            "products" => $products
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method. Only GET requests are allowed."
    ]);
}
?>
