<?php
// Include database configuration
require_once 'config.php';

// Set headers
header("Content-Type: text/html; charset=UTF-8");

// Function to execute SQL script
function executeSqlScript($conn, $file) {
    $sql = file_get_contents($file);

    // Split SQL script into individual statements
    $statements = explode(';', $sql);

    $errors = 0;
    $executed = 0;

    foreach ($statements as $statement) {
        $statement = trim($statement);

        if (!empty($statement)) {
            if ($conn->query($statement) === TRUE) {
                $executed++;
            } else {
                echo "<p style='color: red;'>Error executing statement: " . $conn->error . "</p>";
                echo "<pre>" . $statement . "</pre>";
                $errors++;
            }
        }
    }

    return [
        'executed' => $executed,
        'errors' => $errors
    ];
}

// Check if the script is being executed in CLI mode
$is_cli = php_sapi_name() === 'cli';

// Output format based on execution mode
if ($is_cli) {
    echo "Database Installation Script\n";
    echo "===========================\n\n";
} else {
    echo "<!DOCTYPE html>";
    echo "<html lang='en'>";
    echo "<head>";
    echo "<meta charset='UTF-8'>";
    echo "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
    echo "<title>K-S Enterprise - Database Installation</title>";
    echo "<style>";
    echo "body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }";
    echo ".container { max-width: 800px; margin: 0 auto; }";
    echo ".success { color: green; }";
    echo ".error { color: red; }";
    echo ".box { border: 1px solid #ddd; padding: 20px; border-radius: 5px; margin-bottom: 20px; }";
    echo "</style>";
    echo "</head>";
    echo "<body>";
    echo "<div class='container'>";
    echo "<h1>K-S Enterprise - Database Installation</h1>";
    echo "<div class='box'>";
}

// Check database connection
if ($conn->connect_error) {
    if ($is_cli) {
        echo "Error: Database connection failed: " . $conn->connect_error . "\n";
    } else {
        echo "<p class='error'>Database connection failed: " . $conn->connect_error . "</p>";
    }
    exit;
}

if ($is_cli) {
    echo "Database connection successful.\n\n";
} else {
    echo "<p class='success'>Database connection successful.</p>";
}

// Install database tables
$sql_file = 'create-tables.sql';

if (file_exists($sql_file)) {
    if ($is_cli) {
        echo "Installing database tables...\n";
    } else {
        echo "<p>Installing database tables...</p>";
    }

    $result = executeSqlScript($conn, $sql_file);

    if ($is_cli) {
        echo "Executed " . $result['executed'] . " SQL statements with " . $result['errors'] . " errors.\n";
    } else {
        echo "<p>Executed " . $result['executed'] . " SQL statements";

        if ($result['errors'] > 0) {
            echo " with <span class='error'>" . $result['errors'] . " errors</span>.";
        } else {
            echo " <span class='success'>successfully</span>.";
        }

        echo "</p>";
    }
} else {
    if ($is_cli) {
        echo "Error: SQL file not found: " . $sql_file . "\n";
    } else {
        echo "<p class='error'>SQL file not found: " . $sql_file . "</p>";
    }
}

// Create required directories
$directories = [
    UPLOAD_DIR,
    CATALOG_DIR,
    IMAGES_DIR
];

foreach ($directories as $dir) {
    if (!file_exists($dir)) {
        if (mkdir($dir, 0755, true)) {
            if ($is_cli) {
                echo "Created directory: " . $dir . "\n";
            } else {
                echo "<p class='success'>Created directory: " . $dir . "</p>";
            }
        } else {
            if ($is_cli) {
                echo "Error: Failed to create directory: " . $dir . "\n";
            } else {
                echo "<p class='error'>Failed to create directory: " . $dir . "</p>";
            }
        }
    } else {
        if ($is_cli) {
            echo "Directory already exists: " . $dir . "\n";
        } else {
            echo "<p>Directory already exists: " . $dir . "</p>";
        }
    }
}

// Verify PhpSpreadsheet library
if (!file_exists('vendor/autoload.php')) {
    if ($is_cli) {
        echo "\nWarning: PhpSpreadsheet library not found. You need to install it using Composer:\n";
        echo "composer require phpoffice/phpspreadsheet\n";
    } else {
        echo "<p class='error'>Warning: PhpSpreadsheet library not found. You need to install it using Composer:</p>";
        echo "<pre>composer require phpoffice/phpspreadsheet</pre>";
    }
}

// Display completion message
if ($is_cli) {
    echo "\nInstallation completed. You can now upload Excel catalogs using the admin interface.\n";
} else {
    echo "<p class='success'>Installation completed. You can now upload Excel catalogs using the admin interface.</p>";
    echo "<p><a href='../admin/' style='display: inline-block; background: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;'>Go to Admin Panel</a></p>";
    echo "</div>";
    echo "</div>";
    echo "</body>";
    echo "</html>";
}

// Close database connection
$conn->close();
?>
