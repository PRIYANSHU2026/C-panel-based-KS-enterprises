-- Create products table
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) NOT NULL,
  `images` TEXT,
  `category` VARCHAR(100) NOT NULL,
  `subcategory` VARCHAR(100) NOT NULL,
  `features` TEXT,
  `specifications` TEXT,
  `inStock` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create categories table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create subcategories table
CREATE TABLE IF NOT EXISTS `subcategories` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `category_id` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create upload_history table
CREATE TABLE IF NOT EXISTS `upload_history` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `upload_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('success', 'error') NOT NULL,
  `message` TEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create users table for admin portal access
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `role_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create roles table for admin portal
CREATE TABLE IF NOT EXISTS `roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT,
  `permissions` TEXT NOT NULL COMMENT 'JSON array of permission strings',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create customers table
CREATE TABLE IF NOT EXISTS `customers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `address` TEXT,
  `city` VARCHAR(50),
  `state` VARCHAR(50),
  `postal_code` VARCHAR(20),
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create warranties table to map products to customers
CREATE TABLE IF NOT EXISTS `warranties` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_id` VARCHAR(50) NOT NULL,
  `customer_id` INT NOT NULL,
  `serial_number` VARCHAR(100),
  `purchase_date` DATE NOT NULL,
  `expiration_date` DATE NOT NULL,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default categories
INSERT INTO `categories` (`id`, `name`) VALUES
('garden-tools', 'Garden Tools'),
('power-tools', 'Power Tools'),
('robotic-lawn-mower', 'Robotic Lawn Mower');

-- Insert default subcategories
INSERT INTO `subcategories` (`id`, `name`, `category_id`) VALUES
('aerator-scarifier', 'Cordless Aerator/Scarifier', 'garden-tools'),
('brush-cutter', 'Cordless Brush Cutter', 'garden-tools'),
('chain-saw', 'Cordless Chain Saw', 'garden-tools'),
('hedge-trimmer', 'Cordless Hedge Trimmer', 'garden-tools'),
('hose-reels', 'Cordless Hose Reels (Water)', 'garden-tools'),
('knife-shredder', 'Cordless Knife Shredder', 'garden-tools'),
('lawn-mower', 'Cordless Lawn Mower', 'garden-tools'),
('multi-tools', 'Cordless Multifunctional Tools', 'garden-tools'),
('pruning-shears', 'Cordless Pruning Shears', 'garden-tools'),
('push-sweeper', 'Cordless Push Sweeper', 'garden-tools'),
('sprayer', 'Cordless Sprayer', 'garden-tools'),
('vacuum', 'Cordless Vacuum', 'garden-tools');

-- Insert default roles
INSERT INTO `roles` (`name`, `description`, `permissions`) VALUES
('super_admin', 'Full system access', '["manage_products", "manage_customers", "manage_warranties", "manage_users", "manage_roles"]'),
('admin', 'Administrative access', '["manage_products", "manage_customers", "manage_warranties"]'),
('product_manager', 'Manage product catalog', '["manage_products"]'),
('customer_service', 'Manage customers and warranties', '["manage_customers", "manage_warranties"]');

-- Insert default admin user (password: admin123) - using a simple MD5 hash for compatibility
INSERT INTO `users` (`username`, `password`, `email`, `full_name`, `role_id`) VALUES
('admin', '0192023a7bbd73250516f069df18b500', 'admin@example.com', 'System Administrator', 1);
