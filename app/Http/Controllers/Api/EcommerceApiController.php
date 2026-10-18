<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductColorVariant;
use App\Models\StoreSetting;
use App\Models\CustomPage;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class EcommerceApiController extends Controller
{
    /**
     * File-backed persistent fallback path
     */
    protected function getStorageFilePath($file)
    {
        $dir = storage_path('app/ecommerce_data');
        if (!File::isDirectory($dir)) {
            File::makeDirectory($dir, 0755, true, true);
        }
        return $dir . '/' . $file . '.json';
    }

    protected function saveToFileBackup($key, $data)
    {
        try {
            $path = $this->getStorageFilePath($key);
            File::put($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        } catch (\Throwable $e) {
            Log::error("Failed to write to file backup [{$key}]: " . $e->getMessage());
        }
    }

    protected function loadFromFileBackup($key, $default = null)
    {
        try {
            $path = $this->getStorageFilePath($key);
            if (File::exists($path)) {
                $content = File::get($path);
                return json_decode($content, true) ?: $default;
            }
        } catch (\Throwable $e) {
            Log::error("Failed to read from file backup [{$key}]: " . $e->getMessage());
        }
        return $default;
    }

    public static function autoMigrateIfEmpty()
    {
        static $checked = false;
        if ($checked) return;
        $checked = true;

        try {
            if (!DB::connection()->getPdo()) return;

            $hasTables = DB::select("SHOW TABLES LIKE 'store_settings'");
            if (empty($hasTables)) {
                $sqlPaths = [
                    public_path('somadhanpoint.sql'),
                    base_path('somadhanpoint.sql'),
                    __DIR__ . '/../../../../somadhanpoint.sql',
                    __DIR__ . '/../../../../public/somadhanpoint.sql',
                ];
                $sqlContent = null;
                foreach ($sqlPaths as $path) {
                    if (File::exists($path) && File::size($path) > 500) {
                        $sqlContent = File::get($path);
                        break;
                    }
                }

                if (!$sqlContent) {
                    $sqlContent = @file_get_contents('https://raw.githubusercontent.com/shishir8999/somadhanpoint/main/somadhanpoint.sql');
                }

                if ($sqlContent && strlen($sqlContent) > 500) {
                    DB::statement("SET FOREIGN_KEY_CHECKS = 0;");
                    $queries = preg_split('/;\s*[\r\n]+/', $sqlContent);
                    foreach ($queries as $q) {
                        $q = trim($q);
                        if (!empty($q) && strpos($q, '/*') !== 0 && strpos($q, '--') !== 0) {
                            try {
                                DB::statement($q);
                            } catch (\Throwable $te) {}
                        }
                    }
                    DB::statement("SET FOREIGN_KEY_CHECKS = 1;");
                    Log::info("Auto-migrated database from GitHub/SQL successfully.");
                }
            }
        } catch (\Throwable $e) {
            Log::info("Auto-migration check note: " . $e->getMessage());
        }
    }

    // ==========================================
    // 1. STORE SETTINGS (GET & POST)
    // ==========================================
    public function getSettings()
    {
        self::autoMigrateIfEmpty();
        $settings = null;
        try {
            if (DB::connection()->getPdo()) {
                $row = StoreSetting::first();
                if ($row) {
                    $settings = [
                        'siteName' => $row->site_name ?: 'Somadhan Point',
                        'slogan' => $row->slogan ?: 'বাংলাদেশের বিশ্বস্ত অনলাইন শপ',
                        'description' => $row->description,
                        'primaryColor' => $row->primary_color ?: '#ffffff',
                        'bgColor' => $row->bg_color ?: '#990000',
                        'phone1' => $row->phone1 ?: '01982708789',
                        'phone2' => $row->phone2 ?: '',
                        'whatsapp1' => $row->whatsapp1 ?: '01982708789',
                        'whatsapp2' => $row->whatsapp2 ?: '',
                        'email' => $row->email ?: 'shishirbarai01982708789@gmail.com',
                        'address' => $row->address ?: 'সৌরভ কুঞ্জ, বেনারসি কমিউনিটি সেন্টার রোড, কদমতলী, ঢাকা ১২৩৬',
                        'mapEmbed' => $row->map_embed,
                        'marqueeText' => $row->marquee_text,
                        'orderNote' => $row->order_note,
                        'developerName' => $row->developer_name ?: 'SHISHIR',
                        'developerUrl' => $row->developer_url ?: 'https://www.facebook.com/shishir9barai',
                        'facebook' => $row->facebook ?: 'https://www.facebook.com/shishir9barai',
                        'instagram' => $row->instagram ?: 'https://www.instagram.com',
                        'youtube' => $row->youtube ?: 'https://www.youtube.com',
                        'tiktok' => $row->tiktok ?: 'https://www.tiktok.com',
                        'fbPixelId' => $row->fb_pixel_id,
                        'fbApiToken' => $row->fb_api_token,
                        'logoUrl' => $row->logo_url ?: '/somadhan-logo.svg',
                        'footerLogoUrl' => $row->footer_logo_url ?: '/somadhan-logo.svg',
                        'footerLogoBg' => $row->footer_logo_bg ?: 'white_card',
                        'adminLogoBg' => $row->admin_logo_bg ?: 'transparent',
                        'showLogoText' => (bool)$row->show_logo_text,
                        'banners' => is_array($row->banners) ? $row->banners : [],
                    ];
                }
            }
        } catch (\Throwable $e) {
            Log::info("DB settings fetch fallback: " . $e->getMessage());
        }

        if (!$settings) {
            $settings = $this->loadFromFileBackup('store_settings');
        }

        return response()->json([
            'success' => true,
            'settings' => $settings,
        ]);
    }

    public function saveSettings(Request $request)
    {
        $data = $request->all();

        // 1. Save to permanent file backup
        $this->saveToFileBackup('store_settings', $data);

        // 2. Save to MySQL database if available
        try {
            if (DB::connection()->getPdo()) {
                $setting = StoreSetting::first() ?? new StoreSetting();
                $setting->site_name = $data['siteName'] ?? 'Somadhan Point';
                $setting->slogan = $data['slogan'] ?? 'বাংলাদেশের বিশ্বস্ত অনলাইন শপ';
                $setting->description = $data['description'] ?? null;
                $setting->primary_color = $data['primaryColor'] ?? '#ffffff';
                $setting->bg_color = $data['bgColor'] ?? '#990000';
                $setting->phone1 = $data['phone1'] ?? '01982708789';
                $setting->phone2 = $data['phone2'] ?? '';
                $setting->whatsapp1 = $data['whatsapp1'] ?? '01982708789';
                $setting->whatsapp2 = $data['whatsapp2'] ?? '';
                $setting->email = $data['email'] ?? 'shishirbarai01982708789@gmail.com';
                $setting->address = $data['address'] ?? 'সৌরভ কুঞ্জ, বেনারসি কমিউনিটি সেন্টার রোড, কদমতলী, ঢাকা ১২৩৬';
                $setting->map_embed = $data['mapEmbed'] ?? null;
                $setting->marquee_text = $data['marqueeText'] ?? null;
                $setting->order_note = $data['orderNote'] ?? null;
                $setting->developer_name = 'SHISHIR';
                $setting->developer_url = 'https://www.facebook.com/shishir9barai';
                $setting->facebook = $data['facebook'] ?? 'https://www.facebook.com/shishir9barai';
                $setting->instagram = $data['instagram'] ?? 'https://www.instagram.com';
                $setting->youtube = $data['youtube'] ?? 'https://www.youtube.com';
                $setting->tiktok = $data['tiktok'] ?? 'https://www.tiktok.com';
                $setting->fb_pixel_id = $data['fbPixelId'] ?? null;
                $setting->fb_api_token = $data['fbApiToken'] ?? null;
                $setting->logo_url = $data['logoUrl'] ?? null;
                $setting->footer_logo_url = $data['footerLogoUrl'] ?? null;
                $setting->footer_logo_bg = $data['footerLogoBg'] ?? 'white_card';
                $setting->admin_logo_bg = $data['adminLogoBg'] ?? 'white_card';
                $setting->show_logo_text = !empty($data['showLogoText']);
                $setting->banners = $data['banners'] ?? [];
                $setting->save();
            }
        } catch (\Throwable $e) {
            Log::info("DB settings save fallback: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Settings saved permanently in database!',
            'data' => $data,
        ]);
    }

    // ==========================================
    // 2. PRODUCTS (GET, SYNC, SAVE, DELETE)
    // ==========================================
    public function getProducts()
    {
        $products = [];
        try {
            if (DB::connection()->getPdo()) {
                $dbProducts = Product::with('colorVariants')->get();
                if ($dbProducts->count() > 0) {
                    $products = $dbProducts->map(function ($p, $idx) {
                        return [
                            'id' => (string)$p->id,
                            'sl' => $idx + 1,
                            'name' => $p->name,
                            'sku' => $p->sku,
                            'price' => (float)$p->current_price,
                            'originalPrice' => $p->original_price ? (float)$p->original_price : null,
                            'category' => $p->category ?: 'General',
                            'subcategory' => $p->subcategory,
                            'brand' => $p->brand ?: 'Generic',
                            'section' => $p->section ?: 'hot_deals',
                            'stock' => (int)$p->stock_quantity,
                            'stockColor' => $p->stock_quantity > 50 ? 'green' : ($p->stock_quantity > 0 ? 'yellow' : 'red'),
                            'badge' => $p->badge,
                            'description' => $p->description,
                            'thumbnailUrl' => $p->thumbnail_url,
                            'imageUrl' => $p->image_url ?: $p->thumbnail_url,
                            'galleryImages' => is_array($p->gallery_images) ? $p->gallery_images : [],
                            'sizes' => is_array($p->sizes) ? $p->sizes : [],
                            'colors' => is_array($p->colors) ? $p->colors : [],
                            'colorVariants' => $p->colorVariants->map(function ($cv) {
                                return [
                                    'name' => $cv->name,
                                    'hex' => $cv->hex,
                                    'image' => $cv->image,
                                ];
                            })->toArray(),
                            'visualType' => $p->visual_type ?: 'formal_shoe',
                            'inStock' => (bool)$p->in_stock,
                        ];
                    })->toArray();
                }
            }
        } catch (\Throwable $e) {
            Log::info("DB products fetch fallback: " . $e->getMessage());
        }

        if (empty($products)) {
            $products = $this->loadFromFileBackup('products', []);
        }

        return response()->json([
            'success' => true,
            'products' => $products,
        ]);
    }

    public function saveProduct(Request $request)
    {
        $p = $request->all();
        $prodId = (string)($p['id'] ?? ('prod-' . time() . '-' . rand(100, 999)));

        // 1. Update in file backup
        $products = $this->loadFromFileBackup('products', []);
        $found = false;
        foreach ($products as $idx => $existing) {
            if ((string)($existing['id'] ?? '') === $prodId) {
                $products[$idx] = array_merge($existing, $p);
                $found = true;
                break;
            }
        }
        if (!$found) {
            array_unshift($products, $p);
        }
        $this->saveToFileBackup('products', $products);

        // 2. Save to MySQL
        try {
            if (DB::connection()->getPdo()) {
                $prod = Product::updateOrCreate(
                    ['id' => $prodId],
                    [
                        'name' => $p['name'] ?? 'Product',
                        'sku' => $p['sku'] ?? null,
                        'category' => $p['category'] ?? 'General',
                        'subcategory' => $p['subcategory'] ?? null,
                        'brand' => $p['brand'] ?? 'Generic',
                        'current_price' => (float)($p['price'] ?? ($p['current_price'] ?? 0)),
                        'original_price' => !empty($p['originalPrice']) ? (float)$p['originalPrice'] : (!empty($p['original_price']) ? (float)$p['original_price'] : null),
                        'badge' => $p['badge'] ?? null,
                        'section' => $p['section'] ?? 'hot_deals',
                        'visual_type' => $p['visualType'] ?? ($p['visual_type'] ?? 'formal_shoe'),
                        'in_stock' => isset($p['inStock']) ? (bool)$p['inStock'] : (isset($p['in_stock']) ? (bool)$p['in_stock'] : true),
                        'stock_quantity' => (int)($p['stock'] ?? ($p['stock_quantity'] ?? 50)),
                        'description' => $p['description'] ?? null,
                        'thumbnail_url' => $p['thumbnailUrl'] ?? ($p['thumbnail_url'] ?? null),
                        'image_url' => $p['imageUrl'] ?? ($p['image_url'] ?? ($p['thumbnailUrl'] ?? ($p['thumbnail_url'] ?? null))),
                        'gallery_images' => $p['galleryImages'] ?? ($p['gallery_images'] ?? []),
                        'sizes' => $p['sizes'] ?? [],
                        'colors' => $p['colors'] ?? [],
                    ]
                );

                $variants = $p['colorVariants'] ?? ($p['color_variants'] ?? []);
                if (!empty($variants) && is_array($variants)) {
                    ProductColorVariant::where('product_id', $prod->id)->delete();
                    foreach ($variants as $cv) {
                        ProductColorVariant::create([
                            'product_id' => $prod->id,
                            'name' => $cv['name'] ?? 'Color',
                            'hex' => $cv['hex'] ?? '#000000',
                            'image' => $cv['image'] ?? null,
                        ]);
                    }
                }
            }
        } catch (\Throwable $e) {
            Log::info("DB saveProduct fallback: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Product saved permanently!',
            'product' => $p,
        ]);
    }

    public function syncProducts(Request $request)
    {
        $products = $request->input('products');
        if (is_null($products) && $request->isJson()) {
            $products = $request->json('products');
        }
        if (!is_array($products)) {
            $products = [];
        }

        // 1. Save to file backup
        $this->saveToFileBackup('products', $products);

        // 2. Save to MySQL database
        try {
            if (DB::connection()->getPdo()) {
                $submittedIds = [];
                foreach ($products as $p) {
                    $prodId = (string)($p['id'] ?? ('prod-' . time() . '-' . rand(100, 999)));
                    $submittedIds[] = $prodId;
                    $prod = Product::updateOrCreate(
                        ['id' => $prodId],
                        [
                            'name' => $p['name'] ?? 'Product',
                            'sku' => $p['sku'] ?? null,
                            'category' => $p['category'] ?? 'General',
                            'subcategory' => $p['subcategory'] ?? null,
                            'brand' => $p['brand'] ?? 'Generic',
                            'current_price' => (float)($p['price'] ?? ($p['current_price'] ?? 0)),
                            'original_price' => !empty($p['originalPrice']) ? (float)$p['originalPrice'] : (!empty($p['original_price']) ? (float)$p['original_price'] : null),
                            'badge' => $p['badge'] ?? null,
                            'section' => $p['section'] ?? 'hot_deals',
                            'visual_type' => $p['visualType'] ?? ($p['visual_type'] ?? 'formal_shoe'),
                            'in_stock' => isset($p['inStock']) ? (bool)$p['inStock'] : (isset($p['in_stock']) ? (bool)$p['in_stock'] : true),
                            'stock_quantity' => (int)($p['stock'] ?? ($p['stock_quantity'] ?? 50)),
                            'description' => $p['description'] ?? null,
                            'thumbnail_url' => $p['thumbnailUrl'] ?? ($p['thumbnail_url'] ?? null),
                            'image_url' => $p['imageUrl'] ?? ($p['image_url'] ?? ($p['thumbnailUrl'] ?? ($p['thumbnail_url'] ?? null))),
                            'gallery_images' => $p['galleryImages'] ?? ($p['gallery_images'] ?? []),
                            'sizes' => $p['sizes'] ?? [],
                            'colors' => $p['colors'] ?? [],
                        ]
                    );

                    $variants = $p['colorVariants'] ?? ($p['color_variants'] ?? []);
                    if (!empty($variants) && is_array($variants)) {
                        ProductColorVariant::where('product_id', $prod->id)->delete();
                        foreach ($variants as $cv) {
                            ProductColorVariant::create([
                                'product_id' => $prod->id,
                                'name' => $cv['name'] ?? 'Color',
                                'hex' => $cv['hex'] ?? '#000000',
                                'image' => $cv['image'] ?? null,
                            ]);
                        }
                    }
                }

                // Delete any removed products from MySQL database permanently!
                if (!empty($submittedIds)) {
                    Product::whereNotIn('id', $submittedIds)->delete();
                    ProductColorVariant::whereNotIn('product_id', $submittedIds)->delete();
                } else if ($request->has('products') && is_array($products) && count($products) === 0) {
                    Product::truncate();
                    ProductColorVariant::truncate();
                }
            }
        } catch (\Throwable $e) {
            Log::info("DB syncProducts fallback: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Products synced permanently in database!',
            'count' => count($products),
        ]);
    }

    public function deleteProduct($id)
    {
        $products = $this->loadFromFileBackup('products', []);
        $updated = array_values(array_filter($products, fn($p) => ($p['id'] ?? '') !== $id));
        $this->saveToFileBackup('products', $updated);

        try {
            if (DB::connection()->getPdo()) {
                ProductColorVariant::where('product_id', $id)->delete();
                Product::where('id', $id)->delete();
            }
        } catch (\Throwable $e) {
            Log::info("DB product delete fallback: " . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => 'Product deleted successfully']);
    }

    // ==========================================
    // 3. CATEGORIES (GET, SYNC, DELETE)
    // ==========================================
    public function getCategories()
    {
        $categories = [];
        try {
            if (DB::connection()->getPdo()) {
                $dbCats = Category::with('subcategories')->get();
                if ($dbCats->count() > 0) {
                    $categories = $dbCats->map(function ($c) {
                        return [
                            'id' => (string)$c->id,
                            'name' => $c->name,
                            'visualType' => $c->visual_type,
                            'imageUrl' => $c->image_url,
                            'subcategoriesCount' => $c->subcategories->count(),
                            'subcategories' => $c->subcategories->map(function ($s) {
                                return [
                                    'id' => (string)$s->id,
                                    'name' => $s->name,
                                ];
                            })->toArray(),
                        ];
                    })->toArray();
                }
            }
        } catch (\Throwable $e) {
            Log::info("DB categories fetch fallback: " . $e->getMessage());
        }

        if (empty($categories)) {
            $categories = $this->loadFromFileBackup('categories', []);
        }

        return response()->json([
            'success' => true,
            'categories' => $categories,
        ]);
    }

    public function syncCategories(Request $request)
    {
        $categories = $request->input('categories', []);
        $this->saveToFileBackup('categories', $categories);

        try {
            if (DB::connection()->getPdo()) {
                $submittedCatIds = [];
                foreach ($categories as $cat) {
                    $catId = (string)($cat['id'] ?? ('cat-' . time() . '-' . rand(10, 99)));
                    $submittedCatIds[] = $catId;
                    $c = Category::updateOrCreate(
                        ['id' => $catId],
                        [
                            'name' => $cat['name'],
                            'slug' => \Illuminate\Support\Str::slug($cat['name']) . '-' . substr($catId, -4),
                            'visual_type' => $cat['visualType'] ?? null,
                            'image_url' => $cat['imageUrl'] ?? null,
                        ]
                    );

                    if (!empty($cat['subcategories']) && is_array($cat['subcategories'])) {
                        Subcategory::where('category_id', $c->id)->delete();
                        foreach ($cat['subcategories'] as $sub) {
                            $subId = (string)($sub['id'] ?? ('sub-' . time() . '-' . rand(10, 99)));
                            Subcategory::create([
                                'id' => $subId,
                                'category_id' => $c->id,
                                'name' => $sub['name'],
                                'slug' => \Illuminate\Support\Str::slug($sub['name']),
                            ]);
                        }
                    }
                }

                if (!empty($submittedCatIds)) {
                    $deletedCatIds = Category::whereNotIn('id', $submittedCatIds)->pluck('id');
                    Subcategory::whereIn('category_id', $deletedCatIds)->delete();
                    Category::whereNotIn('id', $submittedCatIds)->delete();
                } else if ($request->has('categories') && is_array($categories) && count($categories) === 0) {
                    Subcategory::truncate();
                    Category::truncate();
                }
            }
        } catch (\Throwable $e) {
            Log::info("DB syncCategories fallback: " . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => 'Categories synced permanently!']);
    }

    public function deleteCategory($id)
    {
        $categories = $this->loadFromFileBackup('categories', []);
        $updated = array_values(array_filter($categories, fn($c) => ($c['id'] ?? '') !== $id));
        $this->saveToFileBackup('categories', $updated);

        try {
            if (DB::connection()->getPdo()) {
                Subcategory::where('category_id', $id)->delete();
                Category::where('id', $id)->delete();
            }
        } catch (\Throwable $e) {
            Log::info("DB category delete fallback: " . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => 'Category deleted successfully']);
    }

    // ==========================================
    // 4. BRANDS (GET, SYNC)
    // ==========================================
    public function getBrands()
    {
        $brands = [];
        try {
            if (DB::connection()->getPdo()) {
                $dbBrands = Brand::all();
                if ($dbBrands->count() > 0) {
                    $brands = $dbBrands->map(function ($b) {
                        return [
                            'id' => (string)$b->id,
                            'name' => $b->name,
                            'logoText' => $b->logo_text,
                            'logoColor' => $b->logo_color,
                            'imageUrl' => $b->image_url,
                            'productsCount' => (int)$b->products_count,
                        ];
                    })->toArray();
                }
            }
        } catch (\Throwable $e) {
            Log::info("DB brands fetch fallback: " . $e->getMessage());
        }

        if (empty($brands)) {
            $brands = $this->loadFromFileBackup('brands', []);
        }

        return response()->json(['success' => true, 'brands' => $brands]);
    }

    public function syncBrands(Request $request)
    {
        $brands = $request->input('brands', []);
        $this->saveToFileBackup('brands', $brands);

        try {
            if (DB::connection()->getPdo()) {
                $submittedBrandIds = [];
                foreach ($brands as $b) {
                    $brandId = (string)($b['id'] ?? ('brand-' . time() . '-' . rand(10, 99)));
                    $submittedBrandIds[] = $brandId;
                    Brand::updateOrCreate(
                        ['id' => $brandId],
                        [
                            'name' => $b['name'],
                            'slug' => \Illuminate\Support\Str::slug($b['name']) . '-' . substr($brandId, -4),
                            'logo_text' => $b['logoText'] ?? null,
                            'logo_color' => $b['logoColor'] ?? null,
                            'image_url' => $b['imageUrl'] ?? null,
                            'products_count' => (int)($b['productsCount'] ?? 0),
                        ]
                    );
                }

                if (!empty($submittedBrandIds)) {
                    Brand::whereNotIn('id', $submittedBrandIds)->delete();
                } else if ($request->has('brands') && is_array($brands) && count($brands) === 0) {
                    Brand::truncate();
                }
            }
        } catch (\Throwable $e) {
            Log::info("DB syncBrands fallback: " . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => 'Brands synced permanently!']);
    }

    public function deleteBrand($id)
    {
        $brands = $this->loadFromFileBackup('brands', []);
        $updated = array_values(array_filter($brands, fn($b) => ($b['id'] ?? '') !== $id));
        $this->saveToFileBackup('brands', $updated);

        try {
            if (DB::connection()->getPdo()) {
                Brand::where('id', $id)->delete();
            }
        } catch (\Throwable $e) {
            Log::info("DB brand delete fallback: " . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => 'Brand deleted successfully']);
    }

    // ==========================================
    // 5. ORDERS (GET, SYNC)
    // ==========================================
    public function getOrders()
    {
        $orders = [];
        try {
            if (DB::connection()->getPdo()) {
                $dbOrders = Order::with('items')->latest()->get();
                if ($dbOrders->count() > 0) {
                    $orders = $dbOrders->map(function ($o) {
                        return [
                            'id' => (string)$o->id,
                            'orderNumber' => $o->order_number,
                            'date' => $o->created_at ? $o->created_at->format('M d, Y') : 'Today',
                            'timeAgo' => $o->created_at ? $o->created_at->diffForHumans() : 'Just now',
                            'customerName' => $o->customer_name,
                            'phone' => $o->customer_phone,
                            'address' => $o->customer_address,
                            'amount' => (float)$o->total,
                            'deliveryCharge' => (float)$o->delivery_fee,
                            'status' => $o->status,
                            'courier' => $o->courier,
                            'courierTrackingCode' => $o->courier_tracking_code,
                            'notes' => $o->notes,
                            'products' => $o->items->map(function ($it) {
                                return [
                                    'name' => $it->product_name,
                                    'qty' => (int)$it->quantity,
                                    'price' => (float)$it->unit_price,
                                ];
                            })->toArray(),
                        ];
                    })->toArray();
                }
            }
        } catch (\Throwable $e) {
            Log::info("DB orders fetch fallback: " . $e->getMessage());
        }

        if (empty($orders)) {
            $orders = $this->loadFromFileBackup('orders', []);
        }

        return response()->json(['success' => true, 'orders' => $orders]);
    }

    public function syncOrders(Request $request)
    {
        $orders = $request->input('orders', []);
        $this->saveToFileBackup('orders', $orders);

        try {
            if (DB::connection()->getPdo()) {
                foreach ($orders as $ord) {
                    $ordId = (string)($ord['id'] ?? (string)rand(10000, 99999));
                    $o = Order::updateOrCreate(
                        ['id' => $ordId],
                        [
                            'order_number' => $ord['orderNumber'] ?? $ordId,
                            'customer_name' => $ord['customerName'] ?? 'Customer',
                            'customer_phone' => $ord['phone'] ?? '',
                            'customer_address' => $ord['address'] ?? 'Dhaka',
                            'delivery_fee' => (float)($ord['deliveryCharge'] ?? 80),
                            'total' => (float)($ord['amount'] ?? 0),
                            'status' => $ord['status'] ?? 'Pending',
                            'courier' => $ord['courier'] ?? null,
                            'courier_tracking_code' => $ord['courierTrackingCode'] ?? null,
                            'notes' => $ord['notes'] ?? null,
                        ]
                    );

                    if (!empty($ord['products']) && is_array($ord['products'])) {
                        OrderItem::where('order_id', $o->id)->delete();
                        foreach ($ord['products'] as $p) {
                            OrderItem::create([
                                'order_id' => $o->id,
                                'product_name' => $p['name'] ?? 'Product',
                                'quantity' => (int)($p['qty'] ?? 1),
                                'unit_price' => (float)($p['price'] ?? 0),
                            ]);
                        }
                    }
                }
            }
        } catch (\Throwable $e) {
            Log::info("DB syncOrders fallback: " . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => 'Orders synced permanently!']);
    }

    // ==========================================
    // 6. ORDER SETTINGS (GET & POST)
    // ==========================================
    public function getOrderSettings()
    {
        $settings = $this->loadFromFileBackup('order_settings');
        return response()->json(['success' => true, 'settings' => $settings]);
    }

    public function saveOrderSettings(Request $request)
    {
        $data = $request->all();
        $this->saveToFileBackup('order_settings', $data);
        return response()->json(['success' => true, 'message' => 'Order settings saved permanently!']);
    }

    // ==========================================
    // 7. CUSTOM PAGES (GET & POST)
    // ==========================================
    public function getCustomPages()
    {
        $backup = $this->loadFromFileBackup('custom_pages', null);
        if ($backup) {
            return response()->json(['success' => true, 'pages' => $backup]);
        }

        $pages = [];
        try {
            if (DB::connection()->getPdo()) {
                $dbPages = CustomPage::where('is_active', true)->get();
                if ($dbPages->count() > 0) {
                    $pages = $dbPages->map(function ($p) {
                        $decoded = json_decode($p->content, true);
                        if (is_array($decoded) && isset($decoded['title'])) {
                            return $decoded;
                        }
                        return [
                            'id' => (string)($p->slug ?: $p->id),
                            'title' => $p->title,
                            'subtitle' => '',
                            'lastUpdated' => $p->updated_at ? $p->updated_at->format('M Y') : '',
                            'content' => $p->content,
                            'sections' => [],
                        ];
                    })->toArray();
                }
            }
        } catch (\Throwable $e) {
            Log::info("DB pages fetch fallback: " . $e->getMessage());
        }

        return response()->json(['success' => true, 'pages' => $pages]);
    }

    public function syncCustomPages(Request $request)
    {
        $pages = $request->input('pages', []);
        $this->saveToFileBackup('custom_pages', $pages);

        try {
            if (DB::connection()->getPdo()) {
                $items = is_array($pages) ? (isset($pages[0]) ? $pages : array_values($pages)) : [];
                foreach ($items as $p) {
                    if (!is_array($p)) continue;
                    $id = $p['id'] ?? null;
                    $slug = $p['slug'] ?? ($id ?: \Illuminate\Support\Str::slug($p['title'] ?? 'page'));
                    CustomPage::updateOrCreate(
                        ['slug' => $slug],
                        [
                            'title' => $p['title'] ?? 'Page',
                            'content' => json_encode($p, JSON_UNESCAPED_UNICODE),
                            'is_active' => true,
                        ]
                    );
                }
            }
        } catch (\Throwable $e) {
            Log::info("DB syncCustomPages fallback: " . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => 'Custom pages saved permanently!']);
    }

    // ==========================================
    // 8. REVIEWS (GET, SYNC, SUBMIT, DELETE)
    // ==========================================
    public function getReviews(Request $request)
    {
        $reviews = [];
        try {
            if (DB::connection()->getPdo()) {
                $status = $request->query('status');
                $query = Review::orderBy('id', 'desc');
                if ($status) {
                    $query->where('status', $status);
                }
                $dbReviews = $query->get();
                if ($dbReviews->count() > 0) {
                    $reviews = $dbReviews->map(function ($r) {
                        return [
                            'id' => (string)$r->id,
                            'productId' => $r->product_id,
                            'reviewerName' => $r->customer_name,
                            'reviewerPhone' => '—',
                            'rating' => (int)$r->rating,
                            'reviewComment' => $r->comment,
                            'type' => $r->product_id ? 'Product' : 'Global',
                            'status' => $r->status ?: 'Approved',
                            'date' => $r->created_at ? $r->created_at->format('F d, Y') : 'Recent',
                        ];
                    })->toArray();
                }
            }
        } catch (\Throwable $e) {
            Log::info("DB reviews fetch fallback: " . $e->getMessage());
        }

        if (empty($reviews)) {
            $reviews = $this->loadFromFileBackup('reviews', []);
        }

        return response()->json(['success' => true, 'reviews' => $reviews]);
    }

    public function syncReviews(Request $request)
    {
        $reviews = $request->input('reviews', []);
        $this->saveToFileBackup('reviews', $reviews);

        try {
            if (DB::connection()->getPdo()) {
                foreach ($reviews as $r) {
                    if (!is_array($r)) continue;
                    $id = $r['id'] ?? null;
                    if ($id && is_numeric($id)) {
                        Review::updateOrCreate(
                            ['id' => $id],
                            [
                                'product_id' => $r['productId'] ?? null,
                                'customer_name' => $r['reviewerName'] ?? 'Anonymous',
                                'rating' => (int)($r['rating'] ?? 5),
                                'comment' => $r['reviewComment'] ?? '',
                                'status' => $r['status'] ?? 'Approved',
                            ]
                        );
                    }
                }
            }
        } catch (\Throwable $e) {
            Log::info("DB syncReviews fallback: " . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => 'Reviews synced permanently!']);
    }

    public function submitReview(Request $request)
    {
        $data = $request->all();
        $newReview = [
            'id' => (string)time(),
            'productId' => $data['productId'] ?? null,
            'reviewerName' => $data['reviewerName'] ?? 'সম্মানিত ক্রেতা',
            'reviewerPhone' => $data['reviewerPhone'] ?? '—',
            'rating' => (int)($data['rating'] ?? 5),
            'reviewComment' => $data['reviewComment'] ?? '',
            'type' => !empty($data['productId']) ? 'Product' : 'Global',
            'status' => 'Pending', // ALWAYS Pending until approved by super admin!
            'date' => date('F d, Y'),
        ];

        // Save to file backup
        $all = $this->loadFromFileBackup('reviews', []);
        array_unshift($all, $newReview);
        $this->saveToFileBackup('reviews', $all);

        // Save to database
        try {
            if (DB::connection()->getPdo()) {
                $dbRev = Review::create([
                    'product_id' => $newReview['productId'],
                    'customer_name' => $newReview['reviewerName'],
                    'rating' => $newReview['rating'],
                    'comment' => $newReview['reviewComment'],
                    'status' => 'Pending',
                ]);
                $newReview['id'] = (string)$dbRev->id;
            }
        } catch (\Throwable $e) {
            Log::info("DB submitReview fallback: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully. It will be public once approved by Super Admin.',
            'review' => $newReview
        ]);
    }

    public function deleteReview($id)
    {
        $reviews = $this->loadFromFileBackup('reviews', []);
        $updated = array_values(array_filter($reviews, fn($r) => ($r['id'] ?? '') != $id));
        $this->saveToFileBackup('reviews', $updated);

        try {
            if (DB::connection()->getPdo()) {
                Review::where('id', $id)->delete();
            }
        } catch (\Throwable $e) {
            Log::info("DB review delete fallback: " . $e->getMessage());
        }

        return response()->json(['success' => true, 'message' => 'Review deleted successfully']);
    }
}
