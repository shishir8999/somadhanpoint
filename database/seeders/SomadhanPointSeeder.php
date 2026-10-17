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
        DB::table('store_settings')->insert([
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
        ]);

        // 2. Admin Roles
        $superAdminRoleId = DB::table('admin_roles')->insertGetId([
            'name' => 'Super Admin',
            'permissions' => json_encode(['all']),
            'is_system' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Admin Staff
        DB::table('admin_staff')->insert([
            'name' => 'শিশির বড়াই (Super Admin)',
            'email' => 'admin@somadhanpoint.com',
            'phone' => '01982708789',
            'password' => Hash::make('admin123456'),
            'role_id' => $superAdminRoleId,
            'role_name' => 'Super Admin',
            'status' => 'Active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 4. Default Categories
        $categories = [
            ['id' => 'cat-1', 'name' => 'ঘি ও তেল', 'slug' => 'ghee-oil', 'visual_type' => 'oil_bottle', 'image_url' => 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80'],
            ['id' => 'cat-2', 'name' => 'মধু ও প্রাকৃতিক খাদ্য', 'slug' => 'honey-food', 'visual_type' => 'honey_jar', 'image_url' => 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80'],
            ['id' => 'cat-3', 'name' => 'জুতা ও স্যান্ডেল', 'slug' => 'shoes-sandals', 'visual_type' => 'formal_shoe', 'image_url' => 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&auto=format&fit=crop&q=80'],
            ['id' => 'cat-4', 'name' => 'চামড়ার ব্যাগ ও মানিব্যাগ', 'slug' => 'leather-bags', 'visual_type' => 'leather_bag', 'image_url' => 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=80'],
            ['id' => 'cat-5', 'name' => 'স্পাইস ও মসলা', 'slug' => 'spices', 'visual_type' => 'spice_pack', 'image_url' => 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80'],
        ];

        foreach ($categories as $cat) {
            DB::table('categories')->insert([
                'id' => $cat['id'],
                'name' => $cat['name'],
                'slug' => $cat['slug'],
                'visual_type' => $cat['visual_type'],
                'image_url' => $cat['image_url'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 5. Default Brands
        $brands = [
            ['id' => 'br-1', 'name' => 'Somadhan Pure', 'slug' => 'somadhan-pure', 'logo_text' => 'SP', 'logo_color' => '#16a34a'],
            ['id' => 'br-2', 'name' => 'Apex Premium', 'slug' => 'apex-premium', 'logo_text' => 'APEX', 'logo_color' => '#990000'],
            ['id' => 'br-3', 'name' => 'Nature Care BD', 'slug' => 'nature-care-bd', 'logo_text' => 'NCB', 'logo_color' => '#ca8a04'],
        ];

        foreach ($brands as $b) {
            DB::table('brands')->insert([
                'id' => $b['id'],
                'name' => $b['name'],
                'slug' => $b['slug'],
                'logo_text' => $b['logo_text'],
                'logo_color' => $b['logo_color'],
                'products_count' => 12,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 6. Default Customer Users
        DB::table('customer_users')->insert([
            [
                'id' => 'user-1',
                'name' => 'শিশির বড়াই',
                'email' => 'shishir@gmail.com',
                'phone' => '01982708789',
                'password' => Hash::make('123456'),
                'created_at_text' => '১২ অক্টোবর ২০২৬, সকাল ১০:৩০',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'user-2',
                'name' => 'মোঃ সাকিব হোসেন',
                'email' => 'sakib@gmail.com',
                'phone' => '01712345678',
                'password' => Hash::make('123456'),
                'created_at_text' => '১৪ অক্টোবর ২০২৬, দুপুর ০২:১৫',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
