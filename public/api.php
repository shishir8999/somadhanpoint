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
} catch (PDOException $e) {
    // If local test database or fallback
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
            $prodId = $p['id'] ?? null;

            // Check if exists
            $exists = false;
            if ($prodId && is_numeric($prodId)) {
                $chk = $pdo->prepare("SELECT id FROM products WHERE id = :id LIMIT 1");
                $chk->execute([':id' => $prodId]);
                $exists = (bool)$chk->fetch();
            }

            if ($exists) {
                // UPDATE
                $stmt = $pdo->prepare("
                    UPDATE products SET
                        name = :name,
                        visual_type = :visual_type,
                        price = :price,
                        original_price = :original_price,
                        discount_percent = :discount_percent,
                        category = :category,
                        subcategory = :subcategory,
                        brand = :brand,
                        stock = :stock,
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
                    ':price' => floatval($p['price'] ?? 0),
                    ':original_price' => !empty($p['originalPrice']) ? floatval($p['originalPrice']) : null,
                    ':discount_percent' => $p['discountPercent'] ?? null,
                    ':category' => $p['category'] ?? 'General',
                    ':subcategory' => $p['subcategory'] ?? null,
                    ':brand' => $p['brand'] ?? 'Somadhan',
                    ':stock' => intval($p['stock'] ?? 100),
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
                $stmt = $pdo->prepare("
                    INSERT INTO products (
                        name, visual_type, price, original_price, discount_percent, category,
                        subcategory, brand, stock, stock_color, section, sku, badge,
                        description, image_url, thumbnail_url, gallery_images, sizes, colors, in_stock, created_at, updated_at
                    ) VALUES (
                        :name, :visual_type, :price, :original_price, :discount_percent, :category,
                        :subcategory, :brand, :stock, :stock_color, :section, :sku, :badge,
                        :description, :image_url, :thumbnail_url, :gallery_images, :sizes, :colors, :in_stock, NOW(), NOW()
                    )
                ");
                $stmt->execute([
                    ':name' => $p['name'] ?? 'Unnamed Product',
                    ':visual_type' => $p['visualType'] ?? 'formal_shoe',
                    ':price' => floatval($p['price'] ?? 0),
                    ':original_price' => !empty($p['originalPrice']) ? floatval($p['originalPrice']) : null,
                    ':discount_percent' => $p['discountPercent'] ?? null,
                    ':category' => $p['category'] ?? 'General',
                    ':subcategory' => $p['subcategory'] ?? null,
                    ':brand' => $p['brand'] ?? 'Somadhan',
                    ':stock' => intval($p['stock'] ?? 100),
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
                $prodId = $pdo->lastInsertId();
            }

            // Sync Color Variants if present
            if (!empty($p['colorVariants']) && is_array($p['colorVariants'])) {
                $pdo->prepare("DELETE FROM product_color_variants WHERE product_id = :id")->execute([':id' => $prodId]);
                $varStmt = $pdo->prepare("
                    INSERT INTO product_color_variants (product_id, color_name, color_code, image_url, stock)
                    VALUES (:pid, :cname, :ccode, :cimg, :cstock)
                ");
                foreach ($p['colorVariants'] as $v) {
                    $varStmt->execute([
                        ':pid' => $prodId,
                        ':cname' => $v['color'] ?? $v['colorName'] ?? 'Color',
                        ':ccode' => $v['colorCode'] ?? '#000000',
                        ':cimg' => $v['image'] ?? $v['imageUrl'] ?? null,
                        ':cstock' => intval($v['stock'] ?? 50),
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
                // If syncing full list, keep database updated
                $keepIds = [];
                foreach ($products as $p) {
                    if (!empty($p['id']) && is_numeric($p['id'])) {
                        $keepIds[] = intval($p['id']);
                    }
                }
                // Delete products in database that are no longer in the list (if non-empty)
                if (count($keepIds) > 0) {
                    $inClause = implode(',', $keepIds);
                    $pdo->exec("DELETE FROM products WHERE id NOT IN ($inClause)");
                }
            }
            echo json_encode(['success' => true, 'message' => 'Products synchronized with MySQL database']);
            exit;
        }

        // GET All Products (/api/products)
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT * FROM products ORDER BY id DESC");
            $rows = $stmt->fetchAll();

            $products = [];
            foreach ($rows as $idx => $r) {
                // Get variants
                $varStmt = $pdo->prepare("SELECT * FROM product_color_variants WHERE product_id = :id");
                $varStmt->execute([':id' => $r['id']]);
                $vars = $varStmt->fetchAll();

                $colorVariants = array_map(function($v) {
                    return [
                        'color' => $v['color_name'],
                        'colorName' => $v['color_name'],
                        'colorCode' => $v['color_code'],
                        'image' => $v['image_url'],
                        'imageUrl' => $v['image_url'],
                        'stock' => intval($v['stock']),
                    ];
                }, $vars);

                $gallery = json_decode($r['gallery_images'] ?? '[]', true) ?: [];
                $sizes = json_decode($r['sizes'] ?? '[]', true) ?: [];
                $colors = json_decode($r['colors'] ?? '[]', true) ?: [];

                $products[] = [
                    'id' => (string)$r['id'],
                    'sl' => $idx + 1,
                    'name' => $r['name'],
                    'visualType' => $r['visual_type'],
                    'price' => floatval($r['price']),
                    'originalPrice' => $r['original_price'] !== null ? floatval($r['original_price']) : null,
                    'discountPercent' => $r['discount_percent'],
                    'category' => $r['category'],
                    'subcategory' => $r['subcategory'],
                    'brand' => $r['brand'],
                    'stock' => intval($r['stock']),
                    'stockColor' => $r['stock_color'] ?: 'green',
                    'section' => $r['section'] ?: 'hot_deals',
                    'sku' => $r['sku'],
                    'badge' => $r['badge'],
                    'description' => $r['description'],
                    'imageUrl' => $r['image_url'] ?: ($gallery[0] ?? '/placeholder.png'),
                    'thumbnailUrl' => $r['thumbnail_url'] ?: $r['image_url'] ?: ($gallery[0] ?? '/placeholder.png'),
                    'galleryImages' => $gallery,
                    'sizes' => $sizes,
                    'colors' => $colors,
                    'colorVariants' => $colorVariants,
                    'inStock' => (bool)$r['in_stock'],
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
                    'visualType' => $c['visual_type'] ?: 'cat_panjabi',
                    'imageUrl' => $c['image_url'],
                    'productCount' => intval($c['product_count'] ?? 0),
                    'status' => $c['status'] ?: 'Active',
                ];
            }, $rows);
            echo json_encode(['success' => true, 'categories' => $categories], JSON_UNESCAPED_UNICODE);
            exit;
        }

        if ($method === 'DELETE' && $resourceId) {
            $pdo->prepare("DELETE FROM categories WHERE id = :id")->execute([':id' => $resourceId]);
            echo json_encode(['success' => true, 'message' => 'Category deleted from database']);
            exit;
        }

        if ($method === 'POST') {
            // sync categories
            $cats = $body['categories'] ?? [];
            if (is_array($cats)) {
                foreach ($cats as $c) {
                    if (empty($c['name'])) continue;
                    $chk = $pdo->prepare("SELECT id FROM categories WHERE name = :name LIMIT 1");
                    $chk->execute([':name' => $c['name']]);
                    $exists = $chk->fetch();
                    if ($exists) {
                        $upd = $pdo->prepare("UPDATE categories SET visual_type = :vt, image_url = :img WHERE id = :id");
                        $upd->execute([':vt' => $c['visualType'] ?? 'cat_panjabi', ':img' => $c['imageUrl'] ?? null, ':id' => $exists['id']]);
                    } else {
                        $ins = $pdo->prepare("INSERT INTO categories (name, slug, visual_type, image_url, status) VALUES (:name, :slug, :vt, :img, 'Active')");
                        $ins->execute([
                            ':name' => $c['name'],
                            ':slug' => preg_replace('/[^a-z0-9]+/i', '-', strtolower($c['name'])),
                            ':vt' => $c['visualType'] ?? 'cat_panjabi',
                            ':img' => $c['imageUrl'] ?? null,
                        ]);
                    }
                }
            }
            echo json_encode(['success' => true, 'message' => 'Categories synced successfully']);
            exit;
        }
    }

    // ---------------------------------------------------------------------
    // 4. BRANDS (/api/brands, /api/brands/{id})
    // ---------------------------------------------------------------------
    if ($resource === 'brands') {
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT * FROM brands ORDER BY id ASC");
            $rows = $stmt->fetchAll();
            $brands = array_map(function($b) {
                return [
                    'id' => (string)$b['id'],
                    'name' => $b['name'],
                    'logoUrl' => $b['logo_url'],
                    'status' => $b['status'] ?: 'Active',
                ];
            }, $rows);
            echo json_encode(['success' => true, 'brands' => $brands], JSON_UNESCAPED_UNICODE);
            exit;
        }

        if ($method === 'DELETE' && $resourceId) {
            $pdo->prepare("DELETE FROM brands WHERE id = :id")->execute([':id' => $resourceId]);
            echo json_encode(['success' => true, 'message' => 'Brand deleted from database']);
            exit;
        }
    }

    // ---------------------------------------------------------------------
    // 5. ORDERS (/api/orders)
    // ---------------------------------------------------------------------
    if ($resource === 'orders') {
        if ($method === 'GET') {
            $stmt = $pdo->query("SELECT * FROM orders ORDER BY id DESC LIMIT 200");
            $rows = $stmt->fetchAll();
            $orders = array_map(function($o) use ($pdo) {
                $itemStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = :oid");
                $itemStmt->execute([':oid' => $o['id']]);
                $items = $itemStmt->fetchAll();

                return [
                    'id' => (string)$o['id'],
                    'orderNumber' => $o['order_number'] ?: ('#' . $o['id']),
                    'customerName' => $o['customer_name'],
                    'phone' => $o['phone'],
                    'address' => $o['address'],
                    'district' => $o['district'],
                    'amount' => floatval($o['amount']),
                    'deliveryCharge' => floatval($o['delivery_charge']),
                    'advancePayment' => floatval($o['advance_payment']),
                    'status' => $o['status'] ?: 'Pending',
                    'notes' => $o['notes'],
                    'items' => array_map(function($i) {
                        return [
                            'name' => $i['product_name'],
                            'quantity' => intval($i['quantity']),
                            'price' => floatval($i['price']),
                            'color' => $i['color'],
                            'size' => $i['size'],
                        ];
                    }, $items),
                    'createdAt' => $o['created_at'],
                ];
            }, $rows);
            echo json_encode(['success' => true, 'orders' => $orders], JSON_UNESCAPED_UNICODE);
            exit;
        }
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
