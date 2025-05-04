<?php
// Start the session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Check if the user is authenticated
 *
 * @return bool Whether the user is authenticated
 */
function isAuthenticated() {
    return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
}

/**
 * Check if the user has a specific permission
 *
 * @param string $permission The permission to check
 * @return bool Whether the user has the permission
 */
function hasPermission($permission) {
    if (!isAuthenticated()) {
        return false;
    }

    return isset($_SESSION['permissions']) && in_array($permission, $_SESSION['permissions']);
}

/**
 * Require authentication for the current request
 * Outputs JSON error and exits if not authenticated
 */
function requireAuth() {
    if (!isAuthenticated()) {
        header("Content-Type: application/json");
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authentication required']);
        exit;
    }
}

/**
 * Require a specific permission for the current request
 * Outputs JSON error and exits if user doesn't have the required permission
 *
 * @param string $permission The required permission
 */
function requirePermission($permission) {
    requireAuth();

    if (!hasPermission($permission)) {
        header("Content-Type: application/json");
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'You do not have permission to perform this action']);
        exit;
    }
}

/**
 * Get the current authenticated user's ID
 *
 * @return int|null The user ID or null if not authenticated
 */
function getCurrentUserId() {
    return isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
}

/**
 * Get the current authenticated user's role ID
 *
 * @return int|null The role ID or null if not authenticated
 */
function getCurrentUserRoleId() {
    return isset($_SESSION['role_id']) ? $_SESSION['role_id'] : null;
}

/**
 * Get the current authenticated user's role name
 *
 * @return string|null The role name or null if not authenticated
 */
function getCurrentUserRoleName() {
    return isset($_SESSION['role_name']) ? $_SESSION['role_name'] : null;
}

/**
 * Set up CORS headers for API requests
 */
function setupCorsHeaders() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

/**
 * Set content type to JSON for API responses
 */
function setJsonHeaders() {
    header("Content-Type: application/json");
}

/**
 * Get the JSON request body as an associative array
 *
 * @return array The request body as an array
 */
function getJsonRequestBody() {
    return json_decode(file_get_contents('php://input'), true) ?: [];
}
?>
