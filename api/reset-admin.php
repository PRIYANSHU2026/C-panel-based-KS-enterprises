<?php
// Include database configuration
require_once 'config.php';

// Simple security check - should be improved in production
$allowed_ips = array('127.0.0.1', '::1'); // localhost
if (!in_array($_SERVER['REMOTE_ADDR'], $allowed_ips)) {
    die('Access denied. This script can only be run locally.');
}

// Default credentials
$default_username = 'admin';
$default_password = 'admin123';
$default_email = 'admin@example.com';
$default_fullname = 'System Administrator';
$default_role_id = 1; // Super admin

// Hash password with MD5 for compatibility
$hashed_password = md5($default_password);

if (isset($_GET['action']) && $_GET['action'] === 'reset') {
    // Reset admin password
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE username = ?");
    $stmt->bind_param("ss", $hashed_password, $default_username);

    if ($stmt->execute()) {
        echo "<div style='padding: 20px; background-color: #d4edda; color: #155724; border-radius: 5px;'>";
        echo "<h2>✅ Admin Password Reset Successfully</h2>";
        echo "<p>Username: <strong>$default_username</strong></p>";
        echo "<p>Password: <strong>$default_password</strong></p>";
        echo "</div>";
    } else {
        echo "<div style='padding: 20px; background-color: #f8d7da; color: #721c24; border-radius: 5px;'>";
        echo "<h2>❌ Error Resetting Password</h2>";
        echo "<p>" . $stmt->error . "</p>";
        echo "</div>";
    }

    $stmt->close();
} else if (isset($_GET['action']) && $_GET['action'] === 'create') {
    // Check if admin user exists
    $check = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $check->bind_param("s", $default_username);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows > 0) {
        echo "<div style='padding: 20px; background-color: #fff3cd; color: #856404; border-radius: 5px;'>";
        echo "<h2>⚠️ Admin User Already Exists</h2>";
        echo "<p>To reset the password, use <a href='?action=reset'>?action=reset</a> instead.</p>";
        echo "</div>";
    } else {
        // Check if roles table exists and has records
        $roleCheck = $conn->query("SELECT id FROM roles WHERE id = 1");

        if ($roleCheck && $roleCheck->num_rows === 0) {
            // Create super_admin role if it doesn't exist
            $permissions = json_encode(["manage_products", "manage_customers", "manage_warranties", "manage_users", "manage_roles"]);
            $roleStmt = $conn->prepare("INSERT INTO roles (id, name, description, permissions) VALUES (1, 'super_admin', 'Full system access', ?)");
            $roleStmt->bind_param("s", $permissions);
            $roleStmt->execute();
            $roleStmt->close();
        }

        // Create admin user
        $stmt = $conn->prepare("INSERT INTO users (username, password, email, full_name, role_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $default_username, $hashed_password, $default_email, $default_fullname, $default_role_id);

        if ($stmt->execute()) {
            echo "<div style='padding: 20px; background-color: #d4edda; color: #155724; border-radius: 5px;'>";
            echo "<h2>✅ Admin User Created Successfully</h2>";
            echo "<p>Username: <strong>$default_username</strong></p>";
            echo "<p>Password: <strong>$default_password</strong></p>";
            echo "</div>";
        } else {
            echo "<div style='padding: 20px; background-color: #f8d7da; color: #721c24; border-radius: 5px;'>";
            echo "<h2>❌ Error Creating Admin User</h2>";
            echo "<p>" . $stmt->error . "</p>";
            echo "</div>";
        }

        $stmt->close();
    }

    $check->close();
} else {
    // Display menu with test form
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Management</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
            .container { max-width: 800px; margin: 0 auto; }
            .card { border: 1px solid #ddd; border-radius: 5px; padding: 20px; margin-bottom: 20px; }
            .card h2 { margin-top: 0; color: #333; }
            .btn { display: inline-block; padding: 10px 15px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px; }
            .btn-blue { background: #2196F3; }
            .btn-red { background: #f44336; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; }
            input[type="text"], input[type="password"] { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
            button { padding: 10px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>K-S Enterprise Admin Management</h1>

            <div class="card">
                <h2>Admin Accounts</h2>
                <p>Use the options below to manage the admin account:</p>
                <a href="?action=create" class="btn">Create Default Admin</a>
                <a href="?action=reset" class="btn btn-blue">Reset Admin Password</a>
            </div>

            <div class="card">
                <h2>Test Authentication</h2>
                <p>Use this form to test if authentication is working properly:</p>
                <form id="testForm">
                    <div class="form-group">
                        <label for="username">Username:</label>
                        <input type="text" id="username" name="username" value="admin">
                    </div>
                    <div class="form-group">
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" value="admin123">
                    </div>
                    <button type="submit">Test Authentication</button>
                </form>
                <div id="result" style="margin-top: 20px; padding: 10px; display: none;"></div>
            </div>
        </div>

        <script>
        document.getElementById('testForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const resultDiv = document.getElementById('result');

            resultDiv.innerHTML = 'Testing authentication...';
            resultDiv.style.display = 'block';
            resultDiv.style.backgroundColor = '#f8f9fa';
            resultDiv.style.color = '#333';

            fetch('../api/admin-auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    resultDiv.style.backgroundColor = '#d4edda';
                    resultDiv.style.color = '#155724';
                    resultDiv.innerHTML = '<strong>Authentication successful!</strong><br>You can now log in to the admin portal.';
                } else {
                    resultDiv.style.backgroundColor = '#f8d7da';
                    resultDiv.style.color = '#721c24';
                    resultDiv.innerHTML = '<strong>Authentication failed:</strong><br>' + data.message;
                }
            })
            .catch(error => {
                resultDiv.style.backgroundColor = '#f8d7da';
                resultDiv.style.color = '#721c24';
                resultDiv.innerHTML = '<strong>Error:</strong><br>' + error.message;
            });
        });
        </script>
    </body>
    </html>
    <?php
}

// Close connection
$conn->close();
?>
