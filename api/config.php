<?php
// Database configuration
define('DB_HOST', 'localhost'); // Your database host (usually localhost in cPanel)
define('DB_USERNAME', 'database_username'); // Your database username
define('DB_PASSWORD', 'database_password'); // Your database password
define('DB_NAME', 'database_name'); // Your database name

// Create database connection
$conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset
$conn->set_charset("utf8mb4");

// Set application variables
define('UPLOAD_DIR', '../uploads/'); // Directory for uploaded Excel files
define('CATALOG_DIR', '../catalog/'); // Directory for catalog data
define('IMAGES_DIR', '../catalog/images/'); // Directory for catalog images

// Create directories if they don't exist
if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

if (!file_exists(CATALOG_DIR)) {
    mkdir(CATALOG_DIR, 0755, true);
}

if (!file_exists(IMAGES_DIR)) {
    mkdir(IMAGES_DIR, 0755, true);
}

// Error reporting settings
ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('error_log', 'php-errors.log');
?>
