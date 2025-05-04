<?php
// Set headers for all responses
header("Content-Type: text/html; charset=UTF-8");

// Display a simple test page
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authentication Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        .card {
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input, textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background: #45a049;
        }
        pre {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            overflow: auto;
        }
        .success {
            color: green;
            font-weight: bold;
        }
        .error {
            color: red;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>Authentication Test Page</h1>

    <div class="card">
        <h2>1. Test Direct Login API</h2>
        <form id="directLoginForm">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" value="admin">
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="text" id="password" value="admin123">
            </div>
            <button type="submit">Test Direct Login</button>
        </form>
        <div id="directLoginResult" style="margin-top: 15px; display: none;"></div>
    </div>

    <div class="card">
        <h2>2. Direct Login Bypass</h2>
        <p>Click the button below to simulate a successful login with hardcoded admin credentials:</p>
        <button id="bypassButton">Generate Admin User JSON</button>
        <div id="bypassResult" style="margin-top: 15px; display: none;"></div>
    </div>

    <div class="card">
        <h2>3. Connection Test</h2>
        <p>This will check if your API endpoints are accessible:</p>
        <button id="connectionTest">Run Connection Test</button>
        <div id="connectionResult" style="margin-top: 15px; display: none;"></div>
    </div>

    <script>
        // Test Direct Login API
        document.getElementById('directLoginForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const resultDiv = document.getElementById('directLoginResult');

            resultDiv.innerHTML = 'Testing direct login API...';
            resultDiv.style.display = 'block';

            fetch('direct-login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => {
                // First get the raw text
                return response.text().then(text => {
                    try {
                        // Try to parse as JSON
                        return {
                            status: response.status,
                            ok: response.ok,
                            data: JSON.parse(text),
                            rawText: text
                        };
                    } catch (e) {
                        // If it's not valid JSON, return the raw text
                        return {
                            status: response.status,
                            ok: response.ok,
                            error: "Invalid JSON response",
                            rawText: text
                        };
                    }
                });
            })
            .then(result => {
                const isSuccess = result.ok && result.data && result.data.success;

                resultDiv.innerHTML = `
                    <p class="${isSuccess ? 'success' : 'error'}">
                        ${isSuccess ? 'SUCCESS' : 'FAILED'}: Status Code ${result.status}
                    </p>
                    <p><strong>Response:</strong></p>
                    <pre>${JSON.stringify(result, null, 2)}</pre>
                `;
            })
            .catch(error => {
                resultDiv.innerHTML = `
                    <p class="error">ERROR: ${error.message}</p>
                    <pre>${error.stack}</pre>
                `;
            });
        });

        // Direct Login Bypass
        document.getElementById('bypassButton').addEventListener('click', function() {
            const hardcodedAdmin = {
                id: 1,
                username: "admin",
                email: "admin@example.com",
                fullName: "System Administrator",
                role: {
                    id: 1,
                    name: "super_admin",
                    permissions: [
                        "manage_products",
                        "manage_customers",
                        "manage_warranties",
                        "manage_users",
                        "manage_roles"
                    ]
                }
            };

            const resultDiv = document.getElementById('bypassResult');
            resultDiv.innerHTML = `
                <p class="success">Admin User JSON Generated</p>
                <p>Copy this JSON and save it to localStorage with the key "admin_user":</p>
                <pre>${JSON.stringify(hardcodedAdmin, null, 2)}</pre>
                <p>To use this in the console:</p>
                <pre>localStorage.setItem("admin_user", JSON.stringify(${JSON.stringify(hardcodedAdmin)}))</pre>
                <button id="copyToClipboard">Copy to Clipboard</button>
            `;
            resultDiv.style.display = 'block';

            document.getElementById('copyToClipboard').addEventListener('click', function() {
                const code = `localStorage.setItem("admin_user", '${JSON.stringify(hardcodedAdmin)}')`;
                navigator.clipboard.writeText(code)
                    .then(() => alert('Copied to clipboard!'))
                    .catch(err => alert('Error copying to clipboard: ' + err));
            });
        });

        // Connection Test
        document.getElementById('connectionTest').addEventListener('click', function() {
            const resultDiv = document.getElementById('connectionResult');
            resultDiv.innerHTML = 'Running connection tests...';
            resultDiv.style.display = 'block';

            const endpoints = [
                'direct-login.php',
                'admin-auth.php',
                'reset-admin.php'
            ];

            const results = [];

            Promise.all(endpoints.map(endpoint => {
                return fetch(endpoint, { method: 'OPTIONS' })
                    .then(response => {
                        results.push({
                            endpoint,
                            status: response.status,
                            statusText: response.statusText,
                            ok: response.ok
                        });
                    })
                    .catch(error => {
                        results.push({
                            endpoint,
                            error: error.message
                        });
                    });
            }))
            .then(() => {
                resultDiv.innerHTML = `
                    <p><strong>Connection Test Results:</strong></p>
                    <pre>${JSON.stringify(results, null, 2)}</pre>
                `;
            });
        });
    </script>
</body>
</html>
