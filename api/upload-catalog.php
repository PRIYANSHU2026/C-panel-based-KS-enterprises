<?php
// Include database configuration
require_once 'config.php';

// Set headers to allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Function to process Excel file
function processExcelFile($file_path) {
    global $conn;

    // Check if the uploaded file is an Excel file
    $file_type = mime_content_type($file_path);
    if ($file_type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
        $file_type !== 'application/vnd.ms-excel') {
        return ["success" => false, "message" => "Uploaded file is not an Excel file."];
    }

    // Require the PhpSpreadsheet library
    require 'vendor/autoload.php';

    try {
        // Load the Excel file
        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($file_path);
        $worksheet = $spreadsheet->getActiveSheet();

        // Get the highest row and column
        $highestRow = $worksheet->getHighestRow();
        $highestColumn = $worksheet->getHighestColumn();

        // Get the column headers
        $headers = [];
        for ($col = 'A'; $col <= $highestColumn; $col++) {
            $headers[$col] = $worksheet->getCell($col . '1')->getValue();
        }

        // Create the products array
        $products = [];
        for ($row = 2; $row <= $highestRow; $row++) {
            $product = [];
            for ($col = 'A'; $col <= $highestColumn; $col++) {
                $cellValue = $worksheet->getCell($col . $row)->getValue();
                $header = $headers[$col];

                if ($header === 'price') {
                    $product[$header] = floatval($cellValue);
                } elseif ($header === 'images') {
                    // Handle comma-separated image URLs
                    $product[$header] = array_map('trim', explode(',', $cellValue));
                } elseif ($header === 'features' || $header === 'specifications') {
                    // Parse JSON for features and specifications
                    $product[$header] = json_decode($cellValue, true);
                } elseif ($header === 'inStock') {
                    $product[$header] = filter_var($cellValue, FILTER_VALIDATE_BOOLEAN);
                } else {
                    $product[$header] = $cellValue;
                }
            }
            $products[] = $product;
        }

        // Save the products to a JSON file
        $json_file = CATALOG_DIR . 'catalog.json';
        file_put_contents($json_file, json_encode($products, JSON_PRETTY_PRINT));

        // Save the products to the database
        // First, clear the existing products table
        $conn->query("TRUNCATE TABLE products");

        // Insert each product into the database
        foreach ($products as $product) {
            $stmt = $conn->prepare("INSERT INTO products (id, name, description, price, images, category, subcategory, features, specifications, inStock)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            $images_json = json_encode($product['images']);
            $features_json = isset($product['features']) ? json_encode($product['features']) : null;
            $specifications_json = isset($product['specifications']) ? json_encode($product['specifications']) : null;
            $inStock = isset($product['inStock']) ? ($product['inStock'] ? 1 : 0) : 1;

            $stmt->bind_param(
                "sssdssssi",
                $product['id'],
                $product['name'],
                $product['description'],
                $product['price'],
                $images_json,
                $product['category'],
                $product['subcategory'],
                $features_json,
                $specifications_json,
                $inStock
            );

            $stmt->execute();
        }

        return ["success" => true, "message" => "Excel file processed successfully.", "products" => $products];
    } catch (\PhpOffice\PhpSpreadsheet\Reader\Exception $e) {
        return ["success" => false, "message" => "Error loading Excel file: " . $e->getMessage()];
    } catch (\Exception $e) {
        return ["success" => false, "message" => "Error processing Excel file: " . $e->getMessage()];
    }
}

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if a file was uploaded
    if (isset($_FILES['catalog_file']) && $_FILES['catalog_file']['error'] === UPLOAD_ERROR_OK) {
        $temp_name = $_FILES['catalog_file']['tmp_name'];
        $file_name = basename($_FILES['catalog_file']['name']);
        $upload_path = UPLOAD_DIR . time() . '_' . $file_name;

        // Move the uploaded file to the upload directory
        if (move_uploaded_file($temp_name, $upload_path)) {
            // Process the Excel file
            $result = processExcelFile($upload_path);

            // Return the result as JSON
            echo json_encode($result);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to move the uploaded file."
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No file uploaded or an error occurred during upload."
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method. Only POST requests are allowed."
    ]);
}
?>
