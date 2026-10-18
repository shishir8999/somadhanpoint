-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: somadhanpoint
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_roles`
--

DROP TABLE IF EXISTS `admin_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_roles`
--

LOCK TABLES `admin_roles` WRITE;
/*!40000 ALTER TABLE `admin_roles` DISABLE KEYS */;
INSERT INTO `admin_roles` VALUES (1,'Super Admin','[\"all\"]',1,'2026-10-17 08:22:26','2026-10-17 08:22:26'),(2,'Super Admin','[\"all\"]',1,'2026-10-17 11:13:29','2026-10-17 11:13:29');
/*!40000 ALTER TABLE `admin_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_staff`
--

DROP TABLE IF EXISTS `admin_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_staff` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` bigint(20) unsigned DEFAULT NULL,
  `role_name` varchar(255) NOT NULL DEFAULT 'Admin',
  `status` varchar(255) NOT NULL DEFAULT 'Active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_staff_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_staff`
--

LOCK TABLES `admin_staff` WRITE;
/*!40000 ALTER TABLE `admin_staff` DISABLE KEYS */;
INSERT INTO `admin_staff` VALUES (1,'শিশির বড়াই (Super Admin)','admin@somadhanpoint.com','01982708789','$2y$12$95BD68.29c6Ae7k3RKYLyeWjy18JCnoKynW1Ekef/1CJu2bllSNh6',1,'Super Admin','Active','2026-10-17 12:05:31','2026-10-17 12:05:31');
/*!40000 ALTER TABLE `admin_staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `brands` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `logo_text` varchar(255) DEFAULT NULL,
  `logo_color` varchar(255) DEFAULT NULL,
  `image_url` longtext DEFAULT NULL,
  `products_count` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `brands_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES ('br-1','Somadhan Pure','somadhan-pure','SP','#16a34a',NULL,12,'2026-10-17 12:05:31','2026-10-17 12:05:31'),('br-2','Apex Premium','apex-premium','APEX','#990000',NULL,12,'2026-10-17 12:05:31','2026-10-17 12:05:31'),('br-3','Nature Care BD','nature-care-bd','NCB','#ca8a04',NULL,12,'2026-10-17 12:05:31','2026-10-17 12:05:31');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `visual_type` varchar(255) DEFAULT NULL,
  `image_url` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('cat-1','ঘি ও তেল','ghee-oil','oil_bottle','https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80','2026-10-17 12:05:31','2026-10-17 12:05:31'),('cat-2','মধু ও প্রাকৃতিক খাদ্য','honey-food','honey_jar','https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80','2026-10-17 12:05:31','2026-10-17 12:05:31'),('cat-3','জুতা ও স্যান্ডেল','shoes-sandals','formal_shoe','https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&auto=format&fit=crop&q=80','2026-10-17 12:05:31','2026-10-17 12:05:31'),('cat-4','চামড়ার ব্যাগ ও মানিব্যাগ','leather-bags','leather_bag','https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=80','2026-10-17 12:05:31','2026-10-17 12:05:31'),('cat-5','স্পাইস ও মসলা','spices','spice_pack','https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80','2026-10-17 12:05:31','2026-10-17 12:05:31');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courier_consignments`
--

DROP TABLE IF EXISTS `courier_consignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courier_consignments` (
  `id` varchar(255) NOT NULL,
  `order_id` varchar(255) NOT NULL,
  `order_number` varchar(255) NOT NULL,
  `courier` varchar(255) NOT NULL,
  `consignment_id` varchar(255) NOT NULL,
  `tracking_code` varchar(255) NOT NULL,
  `tracking_url` varchar(255) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_phone` varchar(255) NOT NULL,
  `customer_address` text NOT NULL,
  `cod_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `delivery_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'In Transit',
  `dispatched_at` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courier_consignments`
--

LOCK TABLES `courier_consignments` WRITE;
/*!40000 ALTER TABLE `courier_consignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `courier_consignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `custom_pages`
--

DROP TABLE IF EXISTS `custom_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `custom_pages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `custom_pages_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `custom_pages`
--

LOCK TABLES `custom_pages` WRITE;
/*!40000 ALTER TABLE `custom_pages` DISABLE KEYS */;
/*!40000 ALTER TABLE `custom_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_users`
--

DROP TABLE IF EXISTS `customer_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer_users` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar_url` longtext DEFAULT NULL,
  `created_at_text` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_users`
--

LOCK TABLES `customer_users` WRITE;
/*!40000 ALTER TABLE `customer_users` DISABLE KEYS */;
INSERT INTO `customer_users` VALUES ('user-1','শিশির বড়াই','shishir@gmail.com','01982708789','$2y$12$RuwlGSXkSPCUV/H3YKGkVOGgdMtoEZdr56.0e/sG0VsF5NgUQvahS',NULL,'১২ অক্টোবর ২০২৬, সকাল ১০:৩০','2026-10-17 12:05:32','2026-10-17 12:05:32'),('user-2','মোঃ সাকিব হোসেন','sakib@gmail.com','01712345678','$2y$12$lln2ky8QblG5lfM.5hstGOdy3Vk1KAfbdipTgUC/ZoAO3a57ielYe',NULL,'১৪ অক্টোবর ২০২৬, দুপুর ০২:১৫','2026-10-17 12:05:32','2026-10-17 12:05:32');
/*!40000 ALTER TABLE `customer_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_10_17_000001_create_somadhanpoint_ecommerce_tables',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` varchar(255) NOT NULL,
  `product_id` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `selected_color` varchar(255) DEFAULT NULL,
  `selected_size` varchar(255) DEFAULT NULL,
  `selected_image` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` varchar(255) NOT NULL,
  `order_number` varchar(255) NOT NULL,
  `customer_user_id` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_phone` varchar(255) NOT NULL,
  `customer_address` text NOT NULL,
  `delivery_area` varchar(255) NOT NULL DEFAULT 'dhaka',
  `delivery_fee` decimal(10,2) NOT NULL DEFAULT 80.00,
  `payment_method` varchar(255) NOT NULL DEFAULT 'cod',
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  `courier` varchar(255) DEFAULT NULL,
  `courier_tracking_code` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_unique` (`order_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_color_variants`
--

DROP TABLE IF EXISTS `product_color_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_color_variants` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `hex` varchar(255) DEFAULT NULL,
  `image` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_color_variants_product_id_foreign` (`product_id`),
  CONSTRAINT `product_color_variants_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_color_variants`
--

LOCK TABLES `product_color_variants` WRITE;
/*!40000 ALTER TABLE `product_color_variants` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_color_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `category_id` varchar(255) DEFAULT NULL,
  `subcategory_id` varchar(255) DEFAULT NULL,
  `brand_id` varchar(255) DEFAULT NULL,
  `category` varchar(255) NOT NULL DEFAULT 'General',
  `subcategory` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `current_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `original_price` decimal(12,2) DEFAULT NULL,
  `badge` varchar(255) DEFAULT NULL,
  `badge_type` varchar(255) NOT NULL DEFAULT 'discount',
  `section` varchar(255) NOT NULL DEFAULT 'hot_deals',
  `visual_type` varchar(255) NOT NULL DEFAULT 'formal_shoe',
  `rating` decimal(3,1) NOT NULL DEFAULT 5.0,
  `in_stock` tinyint(1) NOT NULL DEFAULT 1,
  `stock_quantity` int(11) NOT NULL DEFAULT 50,
  `sku` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `thumbnail_url` longtext DEFAULT NULL,
  `image_url` longtext DEFAULT NULL,
  `gallery_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gallery_images`)),
  `sizes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sizes`)),
  `colors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`colors`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('prod-1','Men\'s Genuine Leather Half Loafer Shoes',NULL,NULL,NULL,NULL,'FORMAL SHOE',NULL,'Apex Premium',1200.00,NULL,NULL,'discount','hot_deals','formal_shoe',5.0,1,50,NULL,NULL,NULL,NULL,'[]','[]','[]','2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-10','Led Rechargeable Key Chain Light',NULL,NULL,NULL,NULL,'FORMAL SHOE',NULL,'Generic',750.00,NULL,NULL,'discount','hot_deals','keychain_light',5.0,1,1000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-11','Regrsi RE-NY032 Wireless Neckband Bluetooth...',NULL,NULL,NULL,NULL,'Wired Headphone',NULL,'Generic',650.00,890.00,'-27%','discount','hot_deals','neckband_headphone',5.0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-12','Hoco W35 Max Wireless Headphone',NULL,NULL,NULL,NULL,'Wired Headphone',NULL,'Walton',1350.00,1450.00,'-7%','discount','hot_deals','wireless_headphone',5.0,1,1000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-13','Ultrapods Max Wireless Earbuds 5.3 Transparent.',NULL,NULL,NULL,NULL,'Wired Headphone',NULL,'Generic',500.00,590.00,'-15%','discount','hot_deals','ultrapods_earbuds',5.0,1,1000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-14','T900 Ultra 2 Pro Smart Watch',NULL,NULL,NULL,NULL,'Smart Watch',NULL,'Generic',980.00,1150.00,'-15%','discount','hot_deals','t900_ultra',5.0,1,1000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-15','Laxasfit S9 pro Smart Watch',NULL,NULL,NULL,NULL,'Smart Watch',NULL,'Generic',1050.00,1190.00,'-12%','discount','hot_deals','s9_smartwatch',5.0,1,1000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-16','SY-322 Multifunctional Wireless Stereo Speaker...',NULL,NULL,NULL,NULL,'Gadget and Accessories',NULL,'Generic',1150.00,1350.00,'-15%','discount','hot_deals','wireless_speaker',5.0,1,99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-17','Cotton Panel Bedsheet CPB100',NULL,NULL,NULL,NULL,'General',NULL,'Generic',1050.00,1350.00,'-22%','discount','hot_deals','bedsheet_set',5.0,1,200,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-1792264808-626','Product',NULL,NULL,NULL,NULL,'General',NULL,'Generic',0.00,NULL,NULL,'discount','hot_deals','formal_shoe',5.0,1,50,NULL,NULL,NULL,NULL,'[]','[]','[]','2026-10-17 13:20:08','2026-10-17 13:20:08'),('prod-18','Hanging Neck Charging Fan',NULL,NULL,NULL,NULL,'Winter Jacket',NULL,'Comforty',900.00,1050.00,'-14%','discount','hot_deals','neck_fan',5.0,1,99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-19','Silver Crest Stainless Steel Body Electric Mini Grinde...',NULL,NULL,NULL,NULL,'Winter Jacket',NULL,'Generic',1350.00,1550.00,'-13%','discount','hot_deals','silver_crest_kettle',5.0,1,100,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-2','Super Water Absorbing Quick Drying Floor Mat',NULL,NULL,NULL,NULL,'General',NULL,'Nature Care BD',500.00,690.00,'-28%','discount','hot_deals','floor_mat',5.0,1,5,NULL,NULL,NULL,NULL,'[]','[]','[]','2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-20','Kids mix Cotton grameen check Khimar Set KCK505',NULL,NULL,NULL,NULL,'Woman Khimar',NULL,'Generic',890.00,NULL,NULL,'discount','hot_deals','cotton_khimar_red',5.0,1,10,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-3','Laxasfit K10 Ultra Smart Watch With Sim Supported',NULL,NULL,NULL,NULL,'Smart Watch',NULL,'Walton',1450.00,1550.00,'-6%','discount','hot_deals','smart_watch',5.0,1,999,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-4','Air 31 Wireless Bluetooth Earbuds',NULL,NULL,NULL,NULL,'Wired Headphone',NULL,'Generic',590.00,790.00,'-25%','discount','hot_deals','air_earbuds',5.0,1,1000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-5','লাক্সারি এরাবিয়ান পারফিউম আতর 10 পিস',NULL,NULL,NULL,NULL,'General',NULL,'Somadhan Pure',1100.00,1350.00,'-19%','discount','hot_deals','oud_perfume',5.0,1,1000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-6','Portable Retro Camping Lamp',NULL,NULL,NULL,NULL,'FORMAL SHOE',NULL,'Generic',1050.00,NULL,NULL,'discount','hot_deals','camping_lamp',5.0,1,1000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-7','Rechargeable USB T-10 Handheld Mini Fan | 3...',NULL,NULL,NULL,NULL,'FORMAL SHOE',NULL,'Vision',480.00,550.00,'-13%','discount','hot_deals','desktop_fan',5.0,1,100,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-8','Vacuum Flask Stainless Steel (500 ml flask)',NULL,NULL,NULL,NULL,'General',NULL,'Generic',750.00,790.00,'-5%','discount','hot_deals','vacuum_flask',5.0,1,1000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32'),('prod-9','Multifunctional 2 In 1 Egg Opener',NULL,NULL,NULL,NULL,'General',NULL,'Generic',650.00,790.00,'-18%','discount','hot_deals','egg_opener',5.0,1,1000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-17 12:05:32','2026-10-17 12:05:32');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` varchar(255) DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `comment` text DEFAULT NULL,
  `verified_purchase` tinyint(1) NOT NULL DEFAULT 1,
  `status` varchar(255) NOT NULL DEFAULT 'Approved',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sent_emails`
--

DROP TABLE IF EXISTS `sent_emails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sent_emails` (
  `id` varchar(255) NOT NULL,
  `to_email` varchar(255) NOT NULL,
  `to_name` varchar(255) NOT NULL,
  `from_email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `body_text` longtext NOT NULL,
  `otp_code` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'welcome',
  `sent_at` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sent_emails`
--

LOCK TABLES `sent_emails` WRITE;
/*!40000 ALTER TABLE `sent_emails` DISABLE KEYS */;
/*!40000 ALTER TABLE `sent_emails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_settings`
--

DROP TABLE IF EXISTS `store_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `store_settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `site_name` varchar(255) NOT NULL DEFAULT 'Somadhan Point',
  `slogan` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `primary_color` varchar(255) NOT NULL DEFAULT '#ffffff',
  `bg_color` varchar(255) NOT NULL DEFAULT '#990000',
  `phone1` varchar(255) DEFAULT NULL,
  `phone2` varchar(255) DEFAULT NULL,
  `whatsapp1` varchar(255) DEFAULT NULL,
  `whatsapp2` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `map_embed` longtext DEFAULT NULL,
  `marquee_text` text DEFAULT NULL,
  `order_note` varchar(255) DEFAULT NULL,
  `developer_name` varchar(255) NOT NULL DEFAULT 'SHISHIR',
  `developer_url` varchar(255) NOT NULL DEFAULT 'https://www.facebook.com/shishir9barai',
  `facebook` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `youtube` varchar(255) DEFAULT NULL,
  `tiktok` varchar(255) DEFAULT NULL,
  `fb_pixel_id` varchar(255) DEFAULT NULL,
  `fb_api_token` text DEFAULT NULL,
  `logo_url` longtext DEFAULT NULL,
  `footer_logo_url` longtext DEFAULT NULL,
  `footer_logo_bg` varchar(255) NOT NULL DEFAULT 'white_card',
  `admin_logo_bg` varchar(255) NOT NULL DEFAULT 'white_card',
  `show_logo_text` tinyint(1) NOT NULL DEFAULT 0,
  `banners` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`banners`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_settings`
--

LOCK TABLES `store_settings` WRITE;
/*!40000 ALTER TABLE `store_settings` DISABLE KEYS */;
INSERT INTO `store_settings` VALUES (1,'Somadhan Point','বাংলাদেশের বিশ্বস্ত অনলাইন শপ','সারাদেশে ক্যাশ অন ডেলিভারি (৪৮ থেকে ৭২ ঘণ্টার মধ্যে নিশ্চিত ডেলিভারি) হটলাইনঃ 01982708789','#ffffff','#990000','01982708789','','01982708789','','shishirbarai01982708789@gmail.com','সৌরভ কুঞ্জ, বেনারসি কমিউনিটি সেন্টার রোড, কদমতলী, ঢাকা ১২৩৬','<iframe src=\"https://www.google.com/maps/embed\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\"></iframe>','বাংলাদেশের বিশ্বস্ত অনলাইন শপ আপনাদের স্বাগতম। সারাদেশে ক্যাশ অন ডেলিভারি (৪৮ থেকে ৭২ ঘণ্টার মধ্যে নিশ্চিত ডেলিভারি) হটলাইনঃ 01982708789','স্টক আউট হওয়ার আগেই অর্ডার করুন','SHISHIR','https://www.facebook.com/shishir9barai','https://www.facebook.com/shishir9barai','https://www.instagram.com','https://www.youtube.com','https://www.tiktok.com',NULL,NULL,'/somadhan-logo.svg','/somadhan-logo.svg','white_card','transparent',0,'[{\"id\":\"b-1\",\"title\":\"\\u09b8\\u09cd\\u09ac\\u09be\\u09b8\\u09cd\\u09a5\\u09cd\\u09af\\u0995\\u09b0 \\u09a4\\u09c7\\u09b2\\u09c7 \\u098f\\u0995\\u099f\\u09bf\\u09ad \\u09a5\\u09be\\u0995\\u09c1\\u09a8 \\u09aa\\u09cd\\u09b0\\u09a4\\u09bf\\u09a6\\u09bf\\u09a8\",\"imageUrl\":\"https:\\/\\/images.unsplash.com\\/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80\",\"link\":\"\\/products\"},{\"id\":\"b-2\",\"title\":\"\\u09b8\\u09b0\\u09be\\u09b8\\u09b0\\u09bf \\u09aa\\u09cd\\u09b0\\u0995\\u09c3\\u09a4\\u09bf \\u09a5\\u09c7\\u0995\\u09c7 \\u0986\\u09aa\\u09a8\\u09be\\u09b0 \\u0998\\u09b0\\u09c7\",\"imageUrl\":\"https:\\/\\/images.unsplash.com\\/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80\",\"link\":\"\\/products\"}]','2026-10-17 12:05:31','2026-10-17 12:05:31'),(2,'Somadhan Point','বাংলাদেশের বিশ্বস্ত অনলাইন শপ','সারাদেশে ক্যাশ অন ডেলিভারি (৪৮ থেকে ৭২ ঘণ্টার মধ্যে নিশ্চিত ডেলিভারি) হটলাইনঃ 01982708789','#ffffff','#990000','01982708789','','01982708789','','shishirbarai01982708789@gmail.com','সৌরভ কুঞ্জ, বেনারসি কমিউনিটি সেন্টার রোড, কদমতলী, ঢাকা ১২৩৬','<iframe src=\"https://www.google.com/maps/embed\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\"></iframe>','বাংলাদেশের বিশ্বস্ত অনলাইন শপ আপনাদের স্বাগতম। সারাদেশে ক্যাশ অন ডেলিভারি (৪৮ থেকে ৭২ ঘণ্টার মধ্যে নিশ্চিত ডেলিভারি) হটলাইনঃ 01982708789','স্টক আউট হওয়ার আগেই অর্ডার করুন','SHISHIR','https://www.facebook.com/shishir9barai','https://www.facebook.com/shishir9barai','https://www.instagram.com','https://www.youtube.com','https://www.tiktok.com',NULL,NULL,NULL,NULL,'white_card','white_card',0,'[{\"id\":\"b-1\",\"title\":\"\\u09b8\\u09cd\\u09ac\\u09be\\u09b8\\u09cd\\u09a5\\u09cd\\u09af\\u0995\\u09b0 \\u09a4\\u09c7\\u09b2\\u09c7 \\u098f\\u0995\\u099f\\u09bf\\u09ad \\u09a5\\u09be\\u0995\\u09c1\\u09a8 \\u09aa\\u09cd\\u09b0\\u09a4\\u09bf\\u09a6\\u09bf\\u09a8\",\"imageUrl\":\"https:\\/\\/images.unsplash.com\\/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80\",\"link\":\"\\/products\"},{\"id\":\"b-2\",\"title\":\"\\u09b8\\u09b0\\u09be\\u09b8\\u09b0\\u09bf \\u09aa\\u09cd\\u09b0\\u0995\\u09c3\\u09a4\\u09bf \\u09a5\\u09c7\\u0995\\u09c7 \\u0986\\u09aa\\u09a8\\u09be\\u09b0 \\u0998\\u09b0\\u09c7\",\"imageUrl\":\"https:\\/\\/images.unsplash.com\\/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80\",\"link\":\"\\/products\"}]','2026-10-17 11:13:29','2026-10-17 11:13:29');
/*!40000 ALTER TABLE `store_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subcategories`
--

DROP TABLE IF EXISTS `subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subcategories` (
  `id` varchar(255) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subcategories_category_id_foreign` (`category_id`),
  CONSTRAINT `subcategories_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategories`
--

LOCK TABLES `subcategories` WRITE;
/*!40000 ALTER TABLE `subcategories` DISABLE KEYS */;
/*!40000 ALTER TABLE `subcategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `avatar` varchar(255) DEFAULT NULL,
  `current_plan_id` varchar(255) DEFAULT NULL,
  `subscription_start_date` timestamp NULL DEFAULT NULL,
  `subscription_expiry` timestamp NULL DEFAULT NULL,
  `token_usage` bigint(20) unsigned NOT NULL DEFAULT 0,
  `max_tokens` bigint(20) unsigned NOT NULL DEFAULT 100000,
  `active_seat_key` varchar(255) DEFAULT NULL,
  `wallet_balance_bdt` decimal(12,2) NOT NULL DEFAULT 0.00,
  `reseller_discount_percent` decimal(5,2) NOT NULL DEFAULT 25.00,
  `joined_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-18 22:18:04
