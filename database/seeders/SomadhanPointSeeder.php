<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SomadhanPointSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Store Settings
        DB::table('store_settings')->updateOrInsert(
            ['id' => 1],
            [
                'site_name' => 'Somadhan Point',
                'slogan' => 'বাংলাদেশের বিশ্বস্ত অনলাইন শপ',
                'description' => 'সারাদেশে ক্যাশ অন ডেলিভারি (৪৮ থেকে ৭২ ঘণ্টার মধ্যে নিশ্চিত ডেলিভারি) হটলাইনঃ 01982708789',
                'primary_color' => '#ffffff',
                'bg_color' => '#990000',
                'phone1' => '01982708789',
                'phone2' => '',
                'whatsapp1' => '01982708789',
                'whatsapp2' => '',
                'email' => 'shishirbarai01982708789@gmail.com',
                'address' => 'সৌরভ কুঞ্জ, বেনারসি কমিউনিটি সেন্টার রোড, কদমতলী, ঢাকা ১২৩৬',
                'map_embed' => '<iframe src="https://www.google.com/maps/embed" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
                'marquee_text' => 'বাংলাদেশের বিশ্বস্ত অনলাইন শপ আপনাদের স্বাগতম। সারাদেশে ক্যাশ অন ডেলিভারি (৪৮ থেকে ৭২ ঘণ্টার মধ্যে নিশ্চিত ডেলিভারি) হটলাইনঃ 01982708789',
                'order_note' => 'স্টক আউট হওয়ার আগেই অর্ডার করুন',
                'developer_name' => 'SHISHIR',
                'developer_url' => 'https://www.facebook.com/shishir9barai',
                'facebook' => 'https://www.facebook.com/shishir9barai',
                'instagram' => 'https://www.instagram.com',
                'youtube' => 'https://www.youtube.com',
                'tiktok' => 'https://www.tiktok.com',
                'footer_logo_bg' => 'white_card',
                'admin_logo_bg' => 'white_card',
                'show_logo_text' => false,
                'banners' => json_encode([
                    [
                        'id' => 'b-1',
                        'title' => 'স্বাস্থ্যকর তেলে একটিভ থাকুন প্রতিদিন',
                        'imageUrl' => 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
                        'link' => '/products',
                    ],
                    [
                        'id' => 'b-2',
                        'title' => 'সরাসরি প্রকৃতি থেকে আপনার ঘরে',
                        'imageUrl' => 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
                        'link' => '/products',
                    ],
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 2. Admin Roles
        $role = DB::table('admin_roles')->where('name', 'Super Admin')->first();
        if ($role) {
            $superAdminRoleId = $role->id;
        } else {
            $superAdminRoleId = DB::table('admin_roles')->insertGetId([
                'name' => 'Super Admin',
                'permissions' => json_encode(['all']),
                'is_system' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 3. Admin Staff
        DB::table('admin_staff')->updateOrInsert(
            ['email' => 'admin@somadhanpoint.com'],
            [
                'name' => 'শিশির বড়াই (Super Admin)',
                'phone' => '01982708789',
                'password' => Hash::make('admin123456'),
                'role_id' => $superAdminRoleId,
                'role_name' => 'Super Admin',
                'status' => 'Active',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 4. Default Categories
        $categories = [
            ['id' => 'cat-1', 'name' => 'ঘি ও তেল', 'slug' => 'ghee-oil', 'visual_type' => 'oil_bottle', 'image_url' => 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80'],
            ['id' => 'cat-2', 'name' => 'মধু ও প্রাকৃতিক খাদ্য', 'slug' => 'honey-food', 'visual_type' => 'honey_jar', 'image_url' => 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80'],
            ['id' => 'cat-3', 'name' => 'জুতা ও স্যান্ডেল', 'slug' => 'shoes-sandals', 'visual_type' => 'formal_shoe', 'image_url' => 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&auto=format&fit=crop&q=80'],
            ['id' => 'cat-4', 'name' => 'চামড়ার ব্যাগ ও মানিব্যাগ', 'slug' => 'leather-bags', 'visual_type' => 'leather_bag', 'image_url' => 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=80'],
            ['id' => 'cat-5', 'name' => 'স্পাইস ও মসলা', 'slug' => 'spices', 'visual_type' => 'spice_pack', 'image_url' => 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80'],
        ];

        foreach ($categories as $cat) {
            DB::table('categories')->updateOrInsert(
                ['id' => $cat['id']],
                [
                    'name' => $cat['name'],
                    'slug' => $cat['slug'],
                    'visual_type' => $cat['visual_type'],
                    'image_url' => $cat['image_url'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // 5. Default Brands
        $brands = [
            ['id' => 'br-1', 'name' => 'Somadhan Pure', 'slug' => 'somadhan-pure', 'logo_text' => 'SP', 'logo_color' => '#16a34a'],
            ['id' => 'br-2', 'name' => 'Apex Premium', 'slug' => 'apex-premium', 'logo_text' => 'APEX', 'logo_color' => '#990000'],
            ['id' => 'br-3', 'name' => 'Nature Care BD', 'slug' => 'nature-care-bd', 'logo_text' => 'NCB', 'logo_color' => '#ca8a04'],
        ];

        foreach ($brands as $b) {
            DB::table('brands')->updateOrInsert(
                ['id' => $b['id']],
                [
                    'name' => $b['name'],
                    'slug' => $b['slug'],
                    'logo_text' => $b['logo_text'],
                    'logo_color' => $b['logo_color'],
                    'products_count' => 12,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }

        // 6. Default Customer Users
        $customers = [
            [
                'id' => 'user-1',
                'name' => 'শিশির বড়াই',
                'email' => 'shishir@gmail.com',
                'phone' => '01982708789',
                'password' => Hash::make('123456'),
                'created_at_text' => '১২ অক্টোবর ২০২৬, সকাল ১০:৩০',
            ],
            [
                'id' => 'user-2',
                'name' => 'মোঃ সাকিব হোসেন',
                'email' => 'sakib@gmail.com',
                'phone' => '01712345678',
                'password' => Hash::make('123456'),
                'created_at_text' => '১৪ অক্টোবর ২০২৬, দুপুর ০২:১৫',
            ]
        ];

        foreach ($customers as $cust) {
            DB::table('customer_users')->updateOrInsert(
                ['email' => $cust['email']],
                array_merge($cust, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }

        // 7. 20 Default Products
        $products = [
            ['id' => 'prod-1', 'name' => "Men's Genuine Leather Half Loafer Shoes", 'visual_type' => 'formal_shoe', 'current_price' => 1200, 'category' => 'FORMAL SHOE', 'brand' => 'Apex Premium', 'stock_quantity' => 50],
            ['id' => 'prod-2', 'name' => 'Super Water Absorbing Quick Drying Floor Mat', 'visual_type' => 'floor_mat', 'current_price' => 500, 'original_price' => 690, 'badge' => '-28%', 'category' => 'General', 'brand' => 'Nature Care BD', 'stock_quantity' => 5],
            ['id' => 'prod-3', 'name' => 'Laxasfit K10 Ultra Smart Watch With Sim Supported', 'visual_type' => 'smart_watch', 'current_price' => 1450, 'original_price' => 1550, 'badge' => '-6%', 'category' => 'Smart Watch', 'brand' => 'Walton', 'stock_quantity' => 999],
            ['id' => 'prod-4', 'name' => 'Air 31 Wireless Bluetooth Earbuds', 'visual_type' => 'air_earbuds', 'current_price' => 590, 'original_price' => 790, 'badge' => '-25%', 'category' => 'Wired Headphone', 'brand' => 'Generic', 'stock_quantity' => 1000],
            ['id' => 'prod-5', 'name' => 'লাক্সারি এরাবিয়ান পারফিউম আতর 10 পিস', 'visual_type' => 'oud_perfume', 'current_price' => 1100, 'original_price' => 1350, 'badge' => '-19%', 'category' => 'General', 'brand' => 'Somadhan Pure', 'stock_quantity' => 1000],
            ['id' => 'prod-6', 'name' => 'Portable Retro Camping Lamp', 'visual_type' => 'camping_lamp', 'current_price' => 1050, 'category' => 'FORMAL SHOE', 'brand' => 'Generic', 'stock_quantity' => 1000],
            ['id' => 'prod-7', 'name' => 'Rechargeable USB T-10 Handheld Mini Fan | 3...', 'visual_type' => 'desktop_fan', 'current_price' => 480, 'original_price' => 550, 'badge' => '-13%', 'category' => 'FORMAL SHOE', 'brand' => 'Vision', 'stock_quantity' => 100],
            ['id' => 'prod-8', 'name' => 'Vacuum Flask Stainless Steel (500 ml flask)', 'visual_type' => 'vacuum_flask', 'current_price' => 750, 'original_price' => 790, 'badge' => '-5%', 'category' => 'General', 'brand' => 'Generic', 'stock_quantity' => 1000],
            ['id' => 'prod-9', 'name' => 'Multifunctional 2 In 1 Egg Opener', 'visual_type' => 'egg_opener', 'current_price' => 650, 'original_price' => 790, 'badge' => '-18%', 'category' => 'General', 'brand' => 'Generic', 'stock_quantity' => 1000],
            ['id' => 'prod-10', 'name' => 'Led Rechargeable Key Chain Light', 'visual_type' => 'keychain_light', 'current_price' => 750, 'category' => 'FORMAL SHOE', 'brand' => 'Generic', 'stock_quantity' => 1000],
            ['id' => 'prod-11', 'name' => 'Regrsi RE-NY032 Wireless Neckband Bluetooth...', 'visual_type' => 'neckband_headphone', 'current_price' => 650, 'original_price' => 890, 'badge' => '-27%', 'category' => 'Wired Headphone', 'brand' => 'Generic', 'stock_quantity' => 0],
            ['id' => 'prod-12', 'name' => 'Hoco W35 Max Wireless Headphone', 'visual_type' => 'wireless_headphone', 'current_price' => 1350, 'original_price' => 1450, 'badge' => '-7%', 'category' => 'Wired Headphone', 'brand' => 'Walton', 'stock_quantity' => 1000],
            ['id' => 'prod-13', 'name' => 'Ultrapods Max Wireless Earbuds 5.3 Transparent.', 'visual_type' => 'ultrapods_earbuds', 'current_price' => 500, 'original_price' => 590, 'badge' => '-15%', 'category' => 'Wired Headphone', 'brand' => 'Generic', 'stock_quantity' => 1000],
            ['id' => 'prod-14', 'name' => 'T900 Ultra 2 Pro Smart Watch', 'visual_type' => 't900_ultra', 'current_price' => 980, 'original_price' => 1150, 'badge' => '-15%', 'category' => 'Smart Watch', 'brand' => 'Generic', 'stock_quantity' => 1000],
            ['id' => 'prod-15', 'name' => 'Laxasfit S9 pro Smart Watch', 'visual_type' => 's9_smartwatch', 'current_price' => 1050, 'original_price' => 1190, 'badge' => '-12%', 'category' => 'Smart Watch', 'brand' => 'Generic', 'stock_quantity' => 1000],
            ['id' => 'prod-16', 'name' => 'SY-322 Multifunctional Wireless Stereo Speaker...', 'visual_type' => 'wireless_speaker', 'current_price' => 1150, 'original_price' => 1350, 'badge' => '-15%', 'category' => 'Gadget and Accessories', 'brand' => 'Generic', 'stock_quantity' => 99],
            ['id' => 'prod-17', 'name' => 'Cotton Panel Bedsheet CPB100', 'visual_type' => 'bedsheet_set', 'current_price' => 1050, 'original_price' => 1350, 'badge' => '-22%', 'category' => 'General', 'brand' => 'Generic', 'stock_quantity' => 200],
            ['id' => 'prod-18', 'name' => 'Hanging Neck Charging Fan', 'visual_type' => 'neck_fan', 'current_price' => 900, 'original_price' => 1050, 'badge' => '-14%', 'category' => 'Winter Jacket', 'brand' => 'Comforty', 'stock_quantity' => 99],
            ['id' => 'prod-19', 'name' => 'Silver Crest Stainless Steel Body Electric Mini Grinde...', 'visual_type' => 'silver_crest_kettle', 'current_price' => 1350, 'original_price' => 1550, 'badge' => '-13%', 'category' => 'Winter Jacket', 'brand' => 'Generic', 'stock_quantity' => 100],
            ['id' => 'prod-20', 'name' => 'Kids mix Cotton grameen check Khimar Set KCK505', 'visual_type' => 'cotton_khimar_red', 'current_price' => 890, 'category' => 'Woman Khimar', 'brand' => 'Generic', 'stock_quantity' => 10],
        ];

        foreach ($products as $p) {
            DB::table('products')->updateOrInsert(
                ['id' => $p['id']],
                array_merge($p, [
                    'in_stock' => ($p['stock_quantity'] ?? 10) > 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }
}
