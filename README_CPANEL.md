# K-S Enterprise - cPanel Deployment Guide

This guide provides step-by-step instructions for deploying the K-S Enterprise website to a cPanel hosting environment. The website includes a catalog management system that allows you to update product information via Excel spreadsheets.

## Prerequisites

- cPanel hosting account with PHP 8.0+ and MySQL 5.7+
- FTP access to your cPanel account
- Composer (if installing on your local machine before uploading)

## Deployment Steps

### 1. Prepare the Website Files

1. Build the Next.js application for static export:
   ```bash
   npm run build
   ```
   This will generate a static version of the website in the `out` directory.

2. Copy the content of the `out` directory to your local machine.

### 2. Set Up the Database

1. Log in to your cPanel account.
2. Navigate to the MySQL Databases section.
3. Create a new database for the website (e.g., `ks_enterprise`).
4. Create a database user and assign it to the database with all privileges.
5. Note down the database name, username, and password.

### 3. Upload Files to cPanel

1. Upload the content of the `out` directory to the `public_html` directory (or a subdirectory if you want to install in a subfolder).
2. Upload the `.htaccess` file to the same directory.
3. Create an `api` directory in the `public_html` directory.
4. Upload the PHP files from the `api` directory to the `api` directory in cPanel.
5. Create an `admin` directory in the `public_html` directory.
6. Upload the PHP files from the `admin` directory to the `admin` directory in cPanel.

### 4. Install PHP Dependencies

1. Connect to your cPanel account via SSH (if available) or use the "Terminal" feature in cPanel.
2. Navigate to the `api` directory:
   ```bash
   cd public_html/api
   ```
3. Install PHP dependencies using Composer:
   ```bash
   composer require phpoffice/phpspreadsheet
   ```

   **Alternative:** If SSH access is not available, you can install the dependencies locally and upload the `vendor` directory to the `api` directory.

### 5. Configure the Database Connection

1. Edit the `api/config.php` file to set your database credentials:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USERNAME', 'your_database_username');
   define('DB_PASSWORD', 'your_database_password');
   define('DB_NAME', 'your_database_name');
   ```

### 6. Run the Installation Script

1. In your web browser, navigate to the installation script:
   ```
   https://your-domain.com/api/install.php
   ```
2. The installation script will:
   - Create the necessary database tables
   - Create required directories for uploads and catalog storage
   - Check for PHP dependencies

3. If there are any errors, follow the instructions provided by the installation script.

### 7. Access the Admin Panel

1. In your web browser, navigate to the admin panel:
   ```
   https://your-domain.com/admin/
   ```
2. Log in with the default credentials:
   - Username: `admin`
   - Password: `admin123`

3. **IMPORTANT**: After logging in, go to the settings page and change the default password to a secure one.

### 8. Update the API URL in the JavaScript Files

1. Locate the JavaScript files that contain API calls in the `_next/static/chunks` directory.
2. Edit the files to update the API base URL to match your domain:
   ```
   const API_BASE_URL = 'https://your-domain.com/api';
   ```

### 9. Upload Your Catalog Data

1. Log in to the admin panel.
2. Use the Excel template provided to create your product catalog.
3. Upload the Excel file through the admin interface.
4. Verify that the products appear correctly on the website.

## Troubleshooting

### Permission Issues

If you encounter permission issues, ensure that the following directories have the correct permissions:
- `api/uploads`: 755 or 775
- `api/catalog`: 755 or 775
- `api/catalog/images`: 755 or 775

You can change permissions using the File Manager in cPanel or via FTP.

### Database Connection Issues

If you encounter database connection issues:
1. Verify that the database credentials in `api/config.php` are correct.
2. Check if the database user has the necessary privileges.
3. Make sure your hosting allows connections to the MySQL server from PHP scripts.

### PHP Dependency Issues

If you encounter issues with PHP dependencies:
1. Make sure PHP 8.0+ is installed and set as the default PHP version in cPanel.
2. Check if the GD library is enabled for image processing.
3. Ensure that the ZIP extension is enabled for handling Excel files.

## Security Recommendations

1. Change the default admin password immediately after installation.
2. Set up HTTPS for your domain if not already configured.
3. Regularly update the PHP dependencies to address security vulnerabilities.
4. Consider adding IP restrictions to the admin directory in your .htaccess file.
5. Set up a scheduled backup for your database and uploaded files.

## Support

If you need assistance with the deployment or encounter any issues, please contact our support team:

- Email: support@ksenterprises.com
- Phone: 9845019069, 7760093353

---

© 2025 K-S Enterprise. All rights reserved.
