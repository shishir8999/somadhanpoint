<?php
/**
 * Somadhan Point - Direct High-Performance MySQL Database API Router
 * Directly connects to MySQL (somadha1_somadhan) to ensure 100% permanent database persistence.
 * Every edit, create, delete, and setting update is permanently written to MySQL tables.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Load .env Configuration
$envPaths = [
    __DIR__ . '/.env',
    __DIR__ . '/../.env',
    dirname(__DIR__) . '/.env',
];

$env = [];
foreach ($envPaths as $p) {
    if (file_exists($p)) {
        $lines = file($p, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || strpos($line, '#') === 0) continue;
            if (strpos($line, '=') !== false) {
                list($k, $v) = explode('=', $line, 2);
                $env[trim($k)] = trim(trim($v), '"\'');
            }
        }
        break;
    }
}

$dbHost = $env['DB_HOST'] ?? '127.0.0.1';
$dbPort = $env['DB_PORT'] ?? '3306';
$dbName = $env['DB_DATABASE'] ?? 'somadha1_somadhan';
$dbUser = $env['DB_USERNAME'] ?? 'somadha1_somadhan';
$dbPass = $env['DB_PASSWORD'] ?? '37Ck!2ok:HMSt5';

// 2. Connect to MySQL via PDO
try {
    $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
} catch (PDOException $e) {
    try {
        $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=somadhanpoint;charset=utf8mb4", "root", "", [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
        $dbName = 'somadhanpoint';
    } catch (PDOException $e2) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database connection failed: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

// Ensure schema columns exist dynamically (Self-healing migration)
try {
    $pCols = $pdo->query("SHOW COLUMNS FROM products")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('price', $pCols) && in_array('current_price', $pCols)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN price decimal(12,2) DEFAULT NULL");
        $pdo->exec("UPDATE products SET price = current_price WHERE price IS NULL");
    }
    if (!in_array('current_price', $pCols) && in_array('price', $pCols)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN current_price decimal(12,2) DEFAULT NULL");
        $pdo->exec("UPDATE products SET current_price = price WHERE current_price IS NULL");
    }
    if (!in_array('stock', $pCols) && in_array('stock_quantity', $pCols)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN stock int(11) DEFAULT 100");
        $pdo->exec("UPDATE products SET stock = stock_quantity WHERE stock IS NULL");
    }
    if (!in_array('stock_quantity', $pCols) && in_array('stock', $pCols)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN stock_quantity int(11) DEFAULT 100");
        $pdo->exec("UPDATE products SET stock_quantity = stock WHERE stock_quantity IS NULL");
    }
    if (!in_array('stock_color', $pCols)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN stock_color varchar(50) DEFAULT 'green'");
    }
    if (!in_array('discount_percent', $pCols)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN discount_percent varchar(50) DEFAULT NULL");
    }
} catch (Exception $e) {
    // Ignore schema sync error if tables are being set up
}

// 3. Determine Endpoint and Method
$method = $_SERVER['REQUEST_METHOD'];
$endpoint = $_GET['endpoint'] ?? '';
if (empty($endpoint)) {
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $endpoint = preg_replace('#^/api/?#', '', $uri);
}
$endpoint = trim($endpoint, '/');
$parts = explode('/', $endpoint);
$resource = $parts[0] ?? '';
$resourceId = $parts[1] ?? null;

// Read JSON input
$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true) ?: [];

// =========================================================================
// ROUTING & DATABASE OPERATIONS
// =========================================================================

try {
    // ---------------------------------------------------------------------
    // 1. SETTINGS (/api/settings)
    // ---------------------------------------------------------------------
    if ($resource === 'settings') {
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT * FROM store_settings LIMIT 1");
            $row = $stmt->fetch();
            if ($row) {
                echo json_encode([
                    'success' => true,
                    'settings' => [
                        'siteName' => $row['site_name'] ?: 'Somadhan Point',
                        'slogan' => $row['slogan'] ?: 'বাংলাদেশের বিশ্বস্ত অনলাইন শপ',
                        'description' => $row['description'],
                        'primaryColor' => $row['primary_color'] ?: '#ffffff',
                        'bgColor' => $row['bg_color'] ?: '#990000',
                        'phone1' => $row['phone1'] ?: '01982708789',
                        'phone2' => $row['phone2'] ?: '',
                        'whatsapp1' => $row['whatsapp1'] ?: '01982708789',
                        'whatsapp2' => $row['whatsapp2'] ?: '',
                        'email' => $row['email'] ?: 'shishirbarai01982708789@gmail.com',
                        'address' => $row['address'] ?: 'সৌরভ কুঞ্জ, বেনারসি কমিউনিটি সেন্টার রোড, কদমতলী, ঢাকা ১২৩৬',
                        'mapEmbed' => $row['map_embed'],
                        'marqueeText' => $row['marquee_text'],
                        'orderNote' => $row['order_note'],
                        'developerName' => $row['developer_name'] ?: 'SHISHIR',
                        'developerUrl' => $row['developer_url'] ?: 'https://www.facebook.com/shishir9barai',
                        'facebook' => $row['facebook'] ?: 'https://www.facebook.com/shishir9barai',
                        'instagram' => $row['instagram'] ?: 'https://www.instagram.com',
                        'youtube' => $row['youtube'] ?: 'https://www.youtube.com',
                        'tiktok' => $row['tiktok'] ?: 'https://www.tiktok.com',
                        'fbPixelId' => $row['fb_pixel_id'],
                        'fbApiToken' => $row['fb_api_token'],
                        'logoUrl' => $row['logo_url'] ?: '/somadhan-logo.svg',
                        'footerLogoUrl' => $row['footer_logo_url'] ?: '/somadhan-logo.svg',
                        'footerLogoBg' => $row['footer_logo_bg'] ?: 'white_card',
                        'adminLogoBg' => $row['admin_logo_bg'] ?: 'transparent',
                        'showLogoText' => (bool)$row['show_logo_text'],
                        'banners' => json_decode($row['banners'] ?? '[]', true) ?: [],
                    ]
                ], JSON_UNESCAPED_UNICODE);
            } else {
                echo json_encode(['success' => true, 'settings' => null]);
            }
            exit;
        }

        if ($method === 'POST') {
            $data = $body;

            // Ensure row 1 exists
            $chk = $pdo->query("SELECT id FROM store_settings LIMIT 1")->fetch();
            if (!$chk) {
                $pdo->prepare("INSERT INTO store_settings (id, site_name, created_at, updated_at) VALUES (1, 'Somadhan Point', NOW(), NOW())")->execute();
            }

            $stmt = $pdo->prepare("
                UPDATE store_settings SET
                    site_name = :site_name,
                    slogan = :slogan,
                    description = :description,
                    primary_color = :primary_color,
                    bg_color = :bg_color,
                    phone1 = :phone1,
                    phone2 = :phone2,
                    whatsapp1 = :whatsapp1,
                    whatsapp2 = :whatsapp2,
                    email = :email,
                    address = :address,
                    map_embed = :map_embed,
                    marquee_text = :marquee_text,
                    order_note = :order_note,
                    developer_name = :developer_name,
                    developer_url = :developer_url,
                    facebook = :facebook,
                    instagram = :instagram,
                    youtube = :youtube,
                    tiktok = :tiktok,
                    fb_pixel_id = :fb_pixel_id,
                    fb_api_token = :fb_api_token,
                    logo_url = :logo_url,
                    footer_logo_url = :footer_logo_url,
                    footer_logo_bg = :footer_logo_bg,
                    admin_logo_bg = :admin_logo_bg,
                    show_logo_text = :show_logo_text,
                    banners = :banners,
                    updated_at = NOW()
                WHERE id = 1
            ");
            $stmt->execute([
                ':site_name' => $data['siteName'] ?? 'Somadhan Point',
                ':slogan' => $data['slogan'] ?? 'বাংলাদেশের বিশ্বস্ত অনলাইন শপ',
                ':description' => $data['description'] ?? '',
                ':primary_color' => $data['primaryColor'] ?? '#ffffff',
                ':bg_color' => $data['bgColor'] ?? '#990000',
                ':phone1' => $data['phone1'] ?? '01982708789',
                ':phone2' => $data['phone2'] ?? '',
                ':whatsapp1' => $data['whatsapp1'] ?? '01982708789',
                ':whatsapp2' => $data['whatsapp2'] ?? '',
                ':email' => $data['email'] ?? 'shishirbarai01982708789@gmail.com',
                ':address' => $data['address'] ?? 'সৌরভ কুঞ্জ, বেনারসি কমিউনিটি সেন্টার রোড, কদমতলী, ঢাকা ১২৩৬',
                ':map_embed' => $data['mapEmbed'] ?? '',
                ':marquee_text' => $data['marqueeText'] ?? '',
                ':order_note' => $data['orderNote'] ?? '',
                ':developer_name' => $data['developerName'] ?? 'SHISHIR',
                ':developer_url' => $data['developerUrl'] ?? 'https://www.facebook.com/shishir9barai',
                ':facebook' => $data['facebook'] ?? 'https://www.facebook.com/shishir9barai',
                ':instagram' => $data['instagram'] ?? 'https://www.instagram.com',
                ':youtube' => $data['youtube'] ?? 'https://www.youtube.com',
                ':tiktok' => $data['tiktok'] ?? 'https://www.tiktok.com',
                ':fb_pixel_id' => $data['fbPixelId'] ?? null,
                ':fb_api_token' => $data['fbApiToken'] ?? null,
                ':logo_url' => $data['logoUrl'] ?? '/somadhan-logo.svg',
                ':footer_logo_url' => $data['footerLogoUrl'] ?? '/somadhan-logo.svg',
                ':footer_logo_bg' => $data['footerLogoBg'] ?? 'white_card',
                ':admin_logo_bg' => $data['adminLogoBg'] ?? 'transparent',
                ':show_logo_text' => !empty($data['showLogoText']) ? 1 : 0,
                ':banners' => json_encode($data['banners'] ?? [], JSON_UNESCAPED_UNICODE),
            ]);

            echo json_encode(['success' => true, 'message' => 'Settings permanently saved to MySQL database']);
            exit;
        }
    }

    // ---------------------------------------------------------------------
    // 2. PRODUCTS (/api/products, /api/products/save, /api/products/{id})
    // ---------------------------------------------------------------------
    if ($resource === 'products') {
        // DELETE Single Product (/api/products/{id})
        if ($method === 'DELETE' && $resourceId) {
            $pdo->prepare("DELETE FROM product_color_variants WHERE product_id = :id")->execute([':id' => $resourceId]);
            $stmt = $pdo->prepare("DELETE FROM products WHERE id = :id OR sku = :id2");
            $stmt->execute([':id' => $resourceId, ':id2' => $resourceId]);

            echo json_encode([
                'success' => true,
                'message' => 'Product permanently deleted from MySQL database',
                'deleted_id' => $resourceId,
            ]);
            exit;
        }

        // SAVE Single Product (/api/products/save)
        if ($method === 'POST' && $resourceId === 'save') {
            $p = $body;
            $prodId = !empty($p['id']) ? (string)$p['id'] : null;

            $exists = false;
            if ($prodId) {
                $chk = $pdo->prepare("SELECT id FROM products WHERE id = :id LIMIT 1");
                $chk->execute([':id' => $prodId]);
                $exists = (bool)$chk->fetch();
            }

            $price = floatval($p['price'] ?? $p['currentPrice'] ?? 0);
            $origPrice = !empty($p['originalPrice']) ? floatval($p['originalPrice']) : null;
            $stock = intval($p['stock'] ?? $p['stock_quantity'] ?? 100);

            if ($exists) {
                // UPDATE
                $stmt = $pdo->prepare("
                    UPDATE products SET
                        name = :name,
                        visual_type = :visual_type,
                        price = :price,
                        current_price = :current_price,
                        original_price = :original_price,
                        discount_percent = :discount_percent,
                        category = :category,
                        subcategory = :subcategory,
                        brand = :brand,
                        stock = :stock,
                        stock_quantity = :stock_quantity,
                        stock_color = :stock_color,
                        section = :section,
                        sku = :sku,
                        badge = :badge,
                        description = :description,
                        image_url = :image_url,
                        thumbnail_url = :thumbnail_url,
                        gallery_images = :gallery_images,
                        sizes = :sizes,
                        colors = :colors,
                        in_stock = :in_stock,
                        updated_at = NOW()
                    WHERE id = :id
                ");
                $stmt->execute([
                    ':id' => $prodId,
                    ':name' => $p['name'] ?? 'Unnamed Product',
                    ':visual_type' => $p['visualType'] ?? 'formal_shoe',
                    ':price' => $price,
                    ':current_price' => $price,
                    ':original_price' => $origPrice,
                    ':discount_percent' => $p['discountPercent'] ?? $p['badge'] ?? null,
                    ':category' => $p['category'] ?? 'General',
                    ':subcategory' => $p['subcategory'] ?? null,
                    ':brand' => $p['brand'] ?? 'Somadhan',
                    ':stock' => $stock,
                    ':stock_quantity' => $stock,
                    ':stock_color' => $p['stockColor'] ?? 'green',
                    ':section' => $p['section'] ?? 'hot_deals',
                    ':sku' => $p['sku'] ?? ('SP-' . rand(1000, 9999)),
                    ':badge' => $p['badge'] ?? null,
                    ':description' => $p['description'] ?? '',
                    ':image_url' => $p['imageUrl'] ?? null,
                    ':thumbnail_url' => $p['thumbnailUrl'] ?? $p['imageUrl'] ?? null,
                    ':gallery_images' => json_encode($p['galleryImages'] ?? [], JSON_UNESCAPED_UNICODE),
                    ':sizes' => json_encode($p['sizes'] ?? [], JSON_UNESCAPED_UNICODE),
                    ':colors' => json_encode($p['colors'] ?? [], JSON_UNESCAPED_UNICODE),
                    ':in_stock' => isset($p['inStock']) ? ($p['inStock'] ? 1 : 0) : 1,
                ]);
            } else {
                // INSERT
                if (!$prodId) {
                    $prodId = 'prod-' . time() . '-' . rand(100, 999);
                }
                $stmt = $pdo->prepare("
                    INSERT INTO products (
                        id, name, visual_type, price, current_price, original_price, discount_percent, category,
                        subcategory, brand, stock, stock_quantity, stock_color, section, sku, badge,
                        description, image_url, thumbnail_url, gallery_images, sizes, colors, in_stock, created_at, updated_at
                    ) VALUES (
                        :id, :name, :visual_type, :price, :current_price, :original_price, :discount_percent, :category,
                        :subcategory, :brand, :stock, :stock_quantity, :stock_color, :section, :sku, :badge,
                        :description, :image_url, :thumbnail_url, :gallery_images, :sizes, :colors, :in_stock, NOW(), NOW()
                    )
                ");
                $stmt->execute([
                    ':id' => $prodId,
                    ':name' => $p['name'] ?? 'Unnamed Product',
                    ':visual_type' => $p['visualType'] ?? 'formal_shoe',
                    ':price' => $price,
                    ':current_price' => $price,
                    ':original_price' => $origPrice,
                    ':discount_percent' => $p['discountPercent'] ?? $p['badge'] ?? null,
                    ':category' => $p['category'] ?? 'General',
                    ':subcategory' => $p['subcategory'] ?? null,
                    ':brand' => $p['brand'] ?? 'Somadhan',
                    ':stock' => $stock,
                    ':stock_quantity' => $stock,
                    ':stock_color' => $p['stockColor'] ?? 'green',
                    ':section' => $p['section'] ?? 'hot_deals',
                    ':sku' => $p['sku'] ?? ('SP-' . rand(1000, 9999)),
                    ':badge' => $p['badge'] ?? null,
                    ':description' => $p['description'] ?? '',
                    ':image_url' => $p['imageUrl'] ?? null,
                    ':thumbnail_url' => $p['thumbnailUrl'] ?? $p['imageUrl'] ?? null,
                    ':gallery_images' => json_encode($p['galleryImages'] ?? [], JSON_UNESCAPED_UNICODE),
                    ':sizes' => json_encode($p['sizes'] ?? [], JSON_UNESCAPED_UNICODE),
                    ':colors' => json_encode($p['colors'] ?? [], JSON_UNESCAPED_UNICODE),
                    ':in_stock' => isset($p['inStock']) ? ($p['inStock'] ? 1 : 0) : 1,
                ]);
            }

            // Sync Color Variants if present
            if (!empty($p['colorVariants']) && is_array($p['colorVariants'])) {
                $pdo->prepare("DELETE FROM product_color_variants WHERE product_id = :id")->execute([':id' => $prodId]);
                $varStmt = $pdo->prepare("
                    INSERT INTO product_color_variants (product_id, name, hex, image, created_at, updated_at)
                    VALUES (:pid, :cname, :ccode, :cimg, NOW(), NOW())
                ");
                foreach ($p['colorVariants'] as $v) {
                    $varStmt->execute([
                        ':pid' => $prodId,
                        ':cname' => $v['color'] ?? $v['colorName'] ?? 'Color',
                        ':ccode' => $v['colorCode'] ?? '#000000',
                        ':cimg' => $v['image'] ?? $v['imageUrl'] ?? null,
                    ]);
                }
            }

            echo json_encode(['success' => true, 'message' => 'Product permanently saved to database', 'id' => $prodId]);
            exit;
        }

        // SYNC Batch Products (/api/products/sync)
        if ($method === 'POST' && $resourceId === 'sync') {
            $products = $body['products'] ?? [];
            if (is_array($products)) {
                $keepIds = [];
                foreach ($products as $p) {
                    if (!empty($p['id'])) {
                        $keepIds[] = (string)$p['id'];
                    }
                }
                if (count($keepIds) > 0) {
                    $placeholders = implode(',', array_fill(0, count($keepIds), '?'));
                    $delStmt = $pdo->prepare("DELETE FROM products WHERE id NOT IN ($placeholders)");
                    $delStmt->execute($keepIds);
                } else {
                    $pdo->exec("DELETE FROM product_color_variants");
                    $pdo->exec("DELETE FROM products");
                }
            }
            echo json_encode(['success' => true, 'message' => 'Products synchronized with MySQL database']);
            exit;
        }

        // GET All Products (/api/products)
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT * FROM products ORDER BY created_at DESC, id DESC");
            $rows = $stmt->fetchAll();

            $products = [];
            foreach ($rows as $idx => $r) {
                // Get variants
                $varStmt = $pdo->prepare("SELECT * FROM product_color_variants WHERE product_id = :id");
                $varStmt->execute([':id' => $r['id']]);
                $vars = $varStmt->fetchAll();

                $colorVariants = array_map(function($v) {
                    return [
                        'color' => $v['name'] ?? $v['color_name'] ?? 'Color',
                        'colorName' => $v['name'] ?? $v['color_name'] ?? 'Color',
                        'colorCode' => $v['hex'] ?? $v['color_code'] ?? '#000000',
                        'image' => $v['image'] ?? $v['image_url'] ?? null,
                        'imageUrl' => $v['image'] ?? $v['image_url'] ?? null,
                        'stock' => isset($v['stock']) ? intval($v['stock']) : 50,
                    ];
                }, $vars);

                $gallery = json_decode($r['gallery_images'] ?? '[]', true) ?: [];
                $sizes = json_decode($r['sizes'] ?? '[]', true) ?: [];
                $colors = json_decode($r['colors'] ?? '[]', true) ?: [];

                $price = isset($r['price']) && $r['price'] !== null ? floatval($r['price']) : (isset($r['current_price']) ? floatval($r['current_price']) : 0);
                $origPrice = ($r['original_price'] !== null && $r['original_price'] !== '') ? floatval($r['original_price']) : null;
                $stock = isset($r['stock']) && $r['stock'] !== null ? intval($r['stock']) : (isset($r['stock_quantity']) ? intval($r['stock_quantity']) : 100);

                $products[] = [
                    'id' => (string)$r['id'],
                    'sl' => $idx + 1,
                    'name' => $r['name'],
                    'visualType' => $r['visual_type'] ?? 'formal_shoe',
                    'price' => $price,
                    'originalPrice' => $origPrice,
                    'discountPercent' => $r['badge'] ?? $r['discount_percent'] ?? null,
                    'category' => $r['category'] ?? 'General',
                    'subcategory' => $r['subcategory'] ?? null,
                    'brand' => $r['brand'] ?? 'Somadhan',
                    'stock' => $stock,
                    'stockColor' => !empty($r['stock_color']) ? $r['stock_color'] : ($stock > 10 ? 'green' : 'orange'),
                    'section' => $r['section'] ?: 'hot_deals',
                    'sku' => $r['sku'] ?: ('SP-' . $r['id']),
                    'badge' => $r['badge'],
                    'description' => $r['description'] ?? '',
                    'imageUrl' => $r['image_url'] ?: ($gallery[0] ?? '/placeholder.png'),
                    'thumbnailUrl' => $r['thumbnail_url'] ?: $r['image_url'] ?: ($gallery[0] ?? '/placeholder.png'),
                    'galleryImages' => $gallery,
                    'sizes' => $sizes,
                    'colors' => $colors,
                    'colorVariants' => $colorVariants,
                    'inStock' => isset($r['in_stock']) ? (bool)$r['in_stock'] : true,
                ];
            }

            echo json_encode(['success' => true, 'products' => $products], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    // ---------------------------------------------------------------------
    // 3. CATEGORIES (/api/categories, /api/categories/{id})
    // ---------------------------------------------------------------------
    if ($resource === 'categories') {
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT * FROM categories ORDER BY id ASC");
            $rows = $stmt->fetchAll();
            $categories = array_map(function($c) {
                return [
                    'id' => (string)$c['id'],
                    'name' => $c['name'],
                    'slug' => $c['slug'],
                    'visualType' => $c['visual_type'],
                    'imageUrl' => $c['image_url'],
                ];
            }, $rows);
            echo json_encode(['success' => true, 'categories' => $categories], JSON_UNESCAPED_UNICODE);
            exit;
        }

        if ($method === 'POST') {
            $cats = $body['categories'] ?? [];
            if (is_array($cats) && count($cats) > 0) {
                foreach ($cats as $c) {
                    $cId = (string)($c['id'] ?? ('cat-' . time() . '-' . rand(10, 99)));
                    $stmt = $pdo->prepare("
                        INSERT INTO categories (id, name, slug, visual_type, image_url, created_at, updated_at)
                        VALUES (:id, :name, :slug, :vtype, :img, NOW(), NOW())
                        ON DUPLICATE KEY UPDATE
                            name = VALUES(name),
                            visual_type = VALUES(visual_type),
                            image_url = VALUES(image_url),
                            updated_at = NOW()
                    ");
                    $stmt->execute([
                        ':id' => $cId,
                        ':name' => $c['name'] ?? 'Category',
                        ':slug' => $c['slug'] ?? ('cat-' . rand(100, 999)),
                        ':vtype' => $c['visualType'] ?? null,
                        ':img' => $c['imageUrl'] ?? null,
                    ]);
                }
            }
            echo json_encode(['success' => true, 'message' => 'Categories synced']);
            exit;
        }

        if ($method === 'DELETE' && $resourceId) {
            $stmt = $pdo->prepare("DELETE FROM categories WHERE id = :id OR slug = :id2");
            $stmt->execute([':id' => $resourceId, ':id2' => $resourceId]);
            echo json_encode(['success' => true, 'message' => 'Category deleted']);
            exit;
        }
    }

    // ---------------------------------------------------------------------
    // 4. BRANDS (/api/brands)
    // ---------------------------------------------------------------------
    if ($resource === 'brands') {
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT * FROM brands ORDER BY name ASC");
            $rows = $stmt->fetchAll();
            echo json_encode(['success' => true, 'brands' => $rows], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    // ---------------------------------------------------------------------
    // 5. ORDERS (/api/orders, /api/orders/create)
    // ---------------------------------------------------------------------
    if ($resource === 'orders') {
        if ($method === 'POST') {
            $ord = $body;
            $orderId = 'ORD-' . strtoupper(substr(uniqid(), -6));
            $orderNumber = 'SP-' . rand(10000, 99999);

            $stmt = $pdo->prepare("
                INSERT INTO orders (
                    id, order_number, customer_name, customer_phone, customer_address,
                    payment_method, delivery_area, subtotal, delivery_charge, discount, total,
                    status, created_at, updated_at
                ) VALUES (
                    :id, :num, :name, :phone, :addr, :pay, :area, :sub, :del, :disc, :tot, 'Pending', NOW(), NOW()
                )
            ");
            $stmt->execute([
                ':id' => $orderId,
                ':num' => $orderNumber,
                ':name' => $ord['customerName'] ?? $ord['name'] ?? 'Guest Customer',
                ':phone' => $ord['customerPhone'] ?? $ord['phone'] ?? '',
                ':addr' => $ord['customerAddress'] ?? $ord['address'] ?? '',
                ':pay' => $ord['paymentMethod'] ?? 'cod',
                ':area' => $ord['deliveryArea'] ?? 'inside_dhaka',
                ':sub' => floatval($ord['subtotal'] ?? 0),
                ':del' => floatval($ord['deliveryCharge'] ?? 60),
                ':disc' => floatval($ord['discount'] ?? 0),
                ':tot' => floatval($ord['total'] ?? 0),
            ]);

            // Save order items
            if (!empty($ord['items']) && is_array($ord['items'])) {
                $itemStmt = $pdo->prepare("
                    INSERT INTO order_items (
                        order_id, product_id, product_name, quantity, unit_price,
                        selected_color, selected_size, created_at, updated_at
                    ) VALUES (
                        :oid, :pid, :pname, :qty, :uprice, :color, :size, NOW(), NOW()
                    )
                ");
                foreach ($ord['items'] as $it) {
                    $itemStmt->execute([
                        ':oid' => $orderId,
                        ':pid' => $it['productId'] ?? $it['id'] ?? null,
                        ':pname' => $it['name'] ?? 'Product',
                        ':qty' => intval($it['quantity'] ?? 1),
                        ':uprice' => floatval($it['price'] ?? 0),
                        ':color' => $it['selectedColor'] ?? null,
                        ':size' => $it['selectedSize'] ?? null,
                    ]);
                }
            }

            echo json_encode([
                'success' => true,
                'message' => 'Order created successfully in database',
                'orderNumber' => $orderNumber,
                'orderId' => $orderId,
            ]);
            exit;
        }

        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 100");
            $rows = $stmt->fetchAll();
            $orders = array_map(function($o) use ($pdo) {
                $iStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = :oid");
                $iStmt->execute([':oid' => $o['id']]);
                $items = $iStmt->fetchAll();
                return [
                    'id' => $o['id'],
                    'orderNumber' => $o['order_number'],
                    'customerName' => $o['customer_name'],
                    'customerPhone' => $o['customer_phone'],
                    'customerAddress' => $o['customer_address'],
                    'total' => floatval($o['total']),
                    'status' => $o['status'],
                    'items' => array_map(function($i) {
                        return [
                            'name' => $i['product_name'],
                            'quantity' => intval($i['quantity']),
                            'price' => floatval($i['unit_price'] ?? $i['price'] ?? 0),
                            'color' => $i['selected_color'] ?? $i['color'] ?? null,
                            'size' => $i['selected_size'] ?? $i['size'] ?? null,
                        ];
                    }, $items),
                    'createdAt' => $o['created_at'],
                ];
            }, $rows);
            echo json_encode(['success' => true, 'orders' => $orders], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    // ---------------------------------------------------------------------
    // 6. GIT FIX (/api/git-fix) - Clears merge conflicts in cPanel Git UI
    // ---------------------------------------------------------------------
    if ($resource === 'git-fix') {
        $dirs = [
            __DIR__,
            dirname(__DIR__),
            '/home/somadha1/public_html',
            '/home/somadha1/repositories/somadhanpoint',
        ];
        $gitDir = null;
        foreach ($dirs as $d) {
            if (is_dir($d . '/.git')) {
                $gitDir = $d;
                break;
            }
        }

        $cmds = [
            "git status",
            "git reset --hard HEAD",
            "git clean -fd",
            "git fetch origin main",
            "git reset --hard origin/main",
            "git status",
        ];

        $results = [];
        if ($gitDir && function_exists('exec')) {
            chdir($gitDir);
            foreach ($cmds as $cmd) {
                $out = [];
                $ret = 0;
                exec($cmd . " 2>&1", $out, $ret);
                $results[] = [
                    'cmd' => $cmd,
                    'output' => $out,
                    'exitCode' => $ret
                ];
            }
        }

        echo json_encode([
            'success' => true,
            'gitDir' => $gitDir,
            'hasExec' => function_exists('exec'),
            'results' => $results,
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    // Fallback: 404 for unknown endpoint
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => "Unknown endpoint: {$endpoint}"]);

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ], JSON_UNESCAPED_UNICODE);
}
