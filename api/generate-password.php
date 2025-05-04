<?php
// Simple security check - should be improved in production
$allowed_ips = array('127.0.0.1', '::1'); // localhost
if (!in_array($_SERVER['REMOTE_ADDR'], $allowed_ips)) {
    die('Access denied. This script can only be run locally.');
}

$password = isset($_GET['password']) ? $_GET['password'] : 'admin123';
$hashed = md5($password);

// Display the result
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Generator</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; }
        .card { border: 1px solid #ddd; border-radius: 5px; padding: 20px; margin-bottom: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input[type="text"] { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { padding: 10px 15px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .result { background: #f8f9fa; border: 1px solid #ddd; padding: 15px; border-radius: 4px; margin-top: 20px; }
        .code { font-family: monospace; background: #f1f1f1; padding: 2px 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Admin Password Generator</h1>

        <div class="card">
            <form method="get">
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="text" id="password" name="password" value="<?php echo htmlspecialchars($password); ?>">
                </div>
                <button type="submit">Generate MD5 Hash</button>
            </form>

            <div class="result">
                <h3>Results:</h3>
                <p><strong>Plain Password:</strong> <?php echo htmlspecialchars($password); ?></p>
                <p><strong>MD5 Hash:</strong> <span class="code"><?php echo $hashed; ?></span></p>

                <h4>SQL Command:</h4>
                <pre class="code">UPDATE users SET password = '<?php echo $hashed; ?>' WHERE username = 'admin';</pre>

                <h4>PHP Code:</h4>
                <pre class="code">$password = '<?php echo htmlspecialchars($password); ?>';
$hash = md5($password); // <?php echo $hashed; ?></pre>
            </div>
        </div>
    </div>
</body>
</html>
