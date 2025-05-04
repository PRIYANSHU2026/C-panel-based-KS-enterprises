<?php
// Start the session
session_start();

// Set secure headers
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("X-Content-Type-Options: nosniff");
header("Referrer-Policy: strict-origin-when-cross-origin");

// Include database configuration
require_once '../api/config.php';

// Check if the user is logged in
$logged_in = isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // Simple hardcoded login (replace with database authentication in production)
    if ($username === 'admin' && $password === 'admin123') {
        $_SESSION['logged_in'] = true;
        $_SESSION['username'] = $username;
        $logged_in = true;
    } else {
        $login_error = 'Invalid username or password.';
    }
}

// Handle logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header('Location: index.php');
    exit;
}

// Get upload history
$upload_history = [];
if ($logged_in) {
    $result = $conn->query("SELECT * FROM upload_history ORDER BY upload_date DESC LIMIT 10");

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $upload_history[] = $row;
        }
    }
}

// Get product count
$product_count = 0;
if ($logged_in) {
    $result = $conn->query("SELECT COUNT(*) as count FROM products");

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $product_count = $row['count'];
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>K-S Enterprise - Admin Panel</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
    <style>
        body {
            padding-top: 20px;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 1200px;
        }
        .login-container {
            max-width: 400px;
            margin: 100px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .card {
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .navbar-brand {
            font-weight: bold;
        }
        .upload-area {
            border: 2px dashed #ddd;
            border-radius: 5px;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
            cursor: pointer;
            transition: border-color 0.3s;
        }
        .upload-area:hover {
            border-color: #aaa;
        }
        .upload-area i {
            font-size: 48px;
            color: #6c757d;
            margin-bottom: 10px;
        }
        #upload-progress {
            display: none;
            margin-top: 10px;
        }
        #file-info {
            display: none;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <?php if ($logged_in): ?>
        <!-- Admin Dashboard -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <a class="navbar-brand" href="#">K-S Enterprise Admin</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="../" target="_blank">View Website</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="?action=logout">Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container mt-4">
            <div class="row">
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body text-center">
                            <h3><?php echo $product_count; ?></h3>
                            <p class="mb-0">Products</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body text-center">
                            <h3><?php echo count($upload_history); ?></h3>
                            <p class="mb-0">Recent Uploads</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body text-center">
                            <h3><?php echo count(scandir(CATALOG_DIR)) - 2; ?></h3>
                            <p class="mb-0">Catalog Files</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body text-center">
                            <h3><?php echo count(scandir(IMAGES_DIR)) - 2; ?></h3>
                            <p class="mb-0">Images</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Upload Excel Catalog</h5>
                        </div>
                        <div class="card-body">
                            <div class="upload-area" id="upload-area">
                                <i class="bi bi-cloud-upload"></i>
                                <h5>Drop Excel file here or click to browse</h5>
                                <p class="text-muted">Supported formats: .xlsx, .xls</p>
                                <input type="file" id="catalog-file" style="display: none;" accept=".xlsx, .xls">
                            </div>

                            <div id="file-info" class="alert alert-info">
                                <span id="file-name"></span>
                                <button class="btn btn-sm btn-outline-secondary float-end" id="remove-file">Remove</button>
                            </div>

                            <div id="upload-progress">
                                <div class="progress">
                                    <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0%"></div>
                                </div>
                                <small class="text-muted mt-1 d-block" id="progress-text">Uploading...</small>
                            </div>

                            <div class="text-end mt-3">
                                <button class="btn btn-primary" id="upload-button" disabled>Upload and Process</button>
                            </div>
                        </div>
                    </div>

                    <div class="card mt-4">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Upload History</h5>
                            <a href="#" class="btn btn-sm btn-outline-secondary">View All</a>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th>File Name</th>
                                            <th>Upload Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php if (empty($upload_history)): ?>
                                            <tr>
                                                <td colspan="4" class="text-center py-3">No upload history found.</td>
                                            </tr>
                                        <?php else: ?>
                                            <?php foreach ($upload_history as $upload): ?>
                                                <tr>
                                                    <td><?php echo htmlspecialchars($upload['file_name']); ?></td>
                                                    <td><?php echo date('M d, Y H:i', strtotime($upload['upload_date'])); ?></td>
                                                    <td>
                                                        <?php if ($upload['status'] === 'success'): ?>
                                                            <span class="badge bg-success">Success</span>
                                                        <?php else: ?>
                                                            <span class="badge bg-danger">Error</span>
                                                        <?php endif; ?>
                                                    </td>
                                                    <td>
                                                        <a href="<?php echo htmlspecialchars($upload['file_path']); ?>" class="btn btn-sm btn-outline-primary">Download</a>
                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        <?php endif; ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Excel Format Guide</h5>
                        </div>
                        <div class="card-body">
                            <p>Your Excel catalog should have the following columns:</p>
                            <ul>
                                <li><strong>id</strong> - Unique product identifier</li>
                                <li><strong>name</strong> - Product name</li>
                                <li><strong>description</strong> - Product description</li>
                                <li><strong>price</strong> - Product price (numeric)</li>
                                <li><strong>images</strong> - Comma-separated image URLs</li>
                                <li><strong>category</strong> - Product category name</li>
                                <li><strong>subcategory</strong> - Product subcategory name</li>
                                <li><strong>features</strong> - JSON array of product features</li>
                                <li><strong>specifications</strong> - JSON object of specifications</li>
                                <li><strong>inStock</strong> - Whether the product is in stock (true/false)</li>
                            </ul>
                            <div class="d-grid">
                                <a href="template.xlsx" class="btn btn-outline-primary">Download Template</a>
                            </div>
                        </div>
                    </div>

                    <div class="card mt-4">
                        <div class="card-header">
                            <h5 class="mb-0">Quick Actions</h5>
                        </div>
                        <div class="card-body">
                            <div class="list-group">
                                <a href="../api/get-catalog.php" target="_blank" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    View API Response
                                    <span class="badge bg-primary rounded-pill">→</span>
                                </a>
                                <a href="backup.php" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    Backup Catalog
                                    <span class="badge bg-primary rounded-pill">→</span>
                                </a>
                                <a href="restore.php" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    Restore Catalog
                                    <span class="badge bg-primary rounded-pill">→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    <?php else: ?>
        <!-- Login Form -->
        <div class="login-container">
            <h2 class="text-center mb-4">Admin Login</h2>

            <?php if (isset($login_error)): ?>
                <div class="alert alert-danger"><?php echo $login_error; ?></div>
            <?php endif; ?>

            <form method="post" action="">
                <input type="hidden" name="action" value="login">

                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control" id="username" name="username" required>
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" name="password" required>
                </div>

                <div class="d-grid">
                    <button type="submit" class="btn btn-primary">Login</button>
                </div>
            </form>
        </div>
    <?php endif; ?>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <?php if ($logged_in): ?>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const uploadArea = document.getElementById('upload-area');
            const fileInput = document.getElementById('catalog-file');
            const fileInfo = document.getElementById('file-info');
            const fileName = document.getElementById('file-name');
            const removeFile = document.getElementById('remove-file');
            const uploadButton = document.getElementById('upload-button');
            const uploadProgress = document.getElementById('upload-progress');
            const progressBar = document.querySelector('.progress-bar');
            const progressText = document.getElementById('progress-text');

            // Handle file selection via click
            uploadArea.addEventListener('click', function() {
                fileInput.click();
            });

            // Handle drag and drop
            uploadArea.addEventListener('dragover', function(e) {
                e.preventDefault();
                uploadArea.style.borderColor = '#0d6efd';
            });

            uploadArea.addEventListener('dragleave', function() {
                uploadArea.style.borderColor = '#ddd';
            });

            uploadArea.addEventListener('drop', function(e) {
                e.preventDefault();
                uploadArea.style.borderColor = '#ddd';

                if (e.dataTransfer.files.length) {
                    fileInput.files = e.dataTransfer.files;
                    handleFileSelection();
                }
            });

            // Handle file selection via input
            fileInput.addEventListener('change', handleFileSelection);

            function handleFileSelection() {
                if (fileInput.files.length) {
                    const file = fileInput.files[0];

                    // Check if the file is an Excel file
                    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                        file.type === 'application/vnd.ms-excel') {

                        fileName.textContent = file.name + ' (' + formatFileSize(file.size) + ')';
                        fileInfo.style.display = 'block';
                        uploadButton.disabled = false;
                    } else {
                        alert('Please select an Excel file (.xlsx or .xls)');
                        resetFileInput();
                    }
                }
            }

            // Handle file removal
            removeFile.addEventListener('click', function() {
                resetFileInput();
            });

            // Handle file upload
            uploadButton.addEventListener('click', function() {
                if (fileInput.files.length) {
                    uploadFile(fileInput.files[0]);
                }
            });

            function uploadFile(file) {
                const formData = new FormData();
                formData.append('catalog_file', file);

                const xhr = new XMLHttpRequest();

                xhr.upload.addEventListener('progress', function(e) {
                    if (e.lengthComputable) {
                        const percentComplete = Math.round((e.loaded / e.total) * 100);
                        progressBar.style.width = percentComplete + '%';
                        progressText.textContent = 'Uploading... ' + percentComplete + '%';
                    }
                });

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            try {
                                const response = JSON.parse(xhr.responseText);

                                if (response.success) {
                                    progressBar.style.width = '100%';
                                    progressBar.classList.remove('progress-bar-animated');
                                    progressText.textContent = 'Upload completed successfully.';

                                    setTimeout(function() {
                                        location.reload();
                                    }, 2000);
                                } else {
                                    progressBar.classList.remove('progress-bar-animated');
                                    progressBar.classList.add('bg-danger');
                                    progressText.textContent = 'Error: ' + response.message;
                                }
                            } catch (error) {
                                progressBar.classList.remove('progress-bar-animated');
                                progressBar.classList.add('bg-danger');
                                progressText.textContent = 'Error parsing server response.';
                            }
                        } else {
                            progressBar.classList.remove('progress-bar-animated');
                            progressBar.classList.add('bg-danger');
                            progressText.textContent = 'Error: ' + xhr.status + ' ' + xhr.statusText;
                        }
                    }
                };

                xhr.open('POST', '../api/upload-catalog.php', true);
                xhr.send(formData);

                uploadProgress.style.display = 'block';
                uploadButton.disabled = true;
            }

            function resetFileInput() {
                fileInput.value = '';
                fileInfo.style.display = 'none';
                uploadButton.disabled = true;
                uploadProgress.style.display = 'none';
                progressBar.style.width = '0%';
                progressBar.classList.add('progress-bar-animated');
                progressBar.classList.remove('bg-danger');
                progressText.textContent = 'Uploading...';
            }

            function formatFileSize(bytes) {
                if (bytes < 1024) {
                    return bytes + ' bytes';
                } else if (bytes < 1048576) {
                    return (bytes / 1024).toFixed(1) + ' KB';
                } else {
                    return (bytes / 1048576).toFixed(1) + ' MB';
                }
            }
        });
    </script>
    <?php endif; ?>
</body>
</html>
