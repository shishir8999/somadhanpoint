<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Categories
        Schema::create('categories', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. cat-1 or honey-ghee
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('visual_type')->nullable();
            $table->longText('image_url')->nullable();
            $table->timestamps();
        });

        // 2. Subcategories
        Schema::create('subcategories', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('category_id');
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->timestamps();
        });

        // 3. Brands
        Schema::create('brands', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo_text')->nullable();
            $table->string('logo_color')->nullable();
            $table->longText('image_url')->nullable();
            $table->integer('products_count')->default(0);
            $table->timestamps();
        });

        // 4. Products
        Schema::create('products', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('slug')->nullable();
            $table->string('category_id')->nullable();
            $table->string('subcategory_id')->nullable();
            $table->string('brand_id')->nullable();
            $table->string('category')->default('General');
            $table->string('subcategory')->nullable();
            $table->string('brand')->nullable();
            $table->decimal('current_price', 12, 2)->default(0);
            $table->decimal('original_price', 12, 2)->nullable();
            $table->string('badge')->nullable();
            $table->string('badge_type')->default('discount');
            $table->string('section')->default('hot_deals'); // hot_deals, flash_sale, top_rated, best_sells, temporary
            $table->string('visual_type')->default('formal_shoe');
            $table->decimal('rating', 3, 1)->default(5.0);
            $table->boolean('in_stock')->default(true);
            $table->integer('stock_quantity')->default(50);
            $table->string('sku')->nullable();
            $table->longText('description')->nullable();
            $table->longText('thumbnail_url')->nullable();
            $table->longText('image_url')->nullable();
            $table->json('gallery_images')->nullable();
            $table->json('sizes')->nullable();
            $table->json('colors')->nullable();
            $table->timestamps();
        });

        // 5. Product Color Variants
        Schema::create('product_color_variants', function (Blueprint $table) {
            $table->id();
            $table->string('product_id');
            $table->string('name');
            $table->string('hex')->nullable();
            $table->longText('image')->nullable();
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->timestamps();
        });

        // 6. Customer Users
        Schema::create('customer_users', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('password');
            $table->longText('avatar_url')->nullable();
            $table->string('created_at_text')->nullable();
            $table->timestamps();
        });

        // 7. Orders
        Schema::create('orders', function (Blueprint $table) {
            $table->string('id')->primary(); // e.g. 57514
            $table->string('order_number')->unique();
            $table->string('customer_user_id')->nullable();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->text('customer_address');
            $table->string('delivery_area')->default('dhaka'); // dhaka, outside_dhaka
            $table->decimal('delivery_fee', 10, 2)->default(80);
            $table->string('payment_method')->default('cod'); // cod, bkash, nagad
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->string('status')->default('Pending'); // Pending, Confirmed, Processing, Shipped, In Transit, Delivered, Cancelled
            $table->string('courier')->nullable(); // Steadfast, Pathao, RedX
            $table->string('courier_tracking_code')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 8. Order Items
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->string('order_id');
            $table->string('product_id')->nullable();
            $table->string('product_name');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 12, 2)->default(0);
            $table->string('selected_color')->nullable();
            $table->string('selected_size')->nullable();
            $table->longText('selected_image')->nullable();
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->timestamps();
        });

        // 9. Courier Consignments
        Schema::create('courier_consignments', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('order_id');
            $table->string('order_number');
            $table->string('courier'); // Steadfast, Pathao, RedX
            $table->string('consignment_id');
            $table->string('tracking_code');
            $table->string('tracking_url');
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->text('customer_address');
            $table->decimal('cod_amount', 12, 2)->default(0);
            $table->decimal('delivery_charge', 12, 2)->default(0);
            $table->text('notes')->nullable();
            $table->string('status')->default('In Transit');
            $table->string('dispatched_at')->nullable();
            $table->timestamps();
        });

        // 10. Store Settings
        Schema::create('store_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name')->default('Somadhan Point');
            $table->string('slogan')->nullable();
            $table->text('description')->nullable();
            $table->string('primary_color')->default('#ffffff');
            $table->string('bg_color')->default('#990000');
            $table->string('phone1')->nullable();
            $table->string('phone2')->nullable();
            $table->string('whatsapp1')->nullable();
            $table->string('whatsapp2')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->longText('map_embed')->nullable();
            $table->text('marquee_text')->nullable();
            $table->string('order_note')->nullable();
            $table->string('developer_name')->default('SHISHIR');
            $table->string('developer_url')->default('https://www.facebook.com/shishir9barai');
            $table->string('facebook')->nullable();
            $table->string('instagram')->nullable();
            $table->string('youtube')->nullable();
            $table->string('tiktok')->nullable();
            $table->string('fb_pixel_id')->nullable();
            $table->text('fb_api_token')->nullable();
            $table->longText('logo_url')->nullable();
            $table->longText('footer_logo_url')->nullable();
            $table->string('footer_logo_bg')->default('white_card');
            $table->string('admin_logo_bg')->default('white_card');
            $table->boolean('show_logo_text')->default(false);
            $table->json('banners')->nullable();
            $table->timestamps();
        });

        // 11. Custom Pages
        Schema::create('custom_pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('content')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 12. Reviews
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->string('product_id')->nullable();
            $table->string('customer_name');
            $table->integer('rating')->default(5);
            $table->text('comment')->nullable();
            $table->boolean('verified_purchase')->default(true);
            $table->string('status')->default('Approved');
            $table->timestamps();
        });

        // 13. Sent Emails Log
        Schema::create('sent_emails', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('to_email');
            $table->string('to_name');
            $table->string('from_email');
            $table->string('subject');
            $table->longText('body_text');
            $table->string('otp_code')->nullable();
            $table->string('type')->default('welcome');
            $table->string('sent_at');
            $table->timestamps();
        });

        // 14. Roles & Permissions
        Schema::create('admin_roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('permissions')->nullable();
            $table->boolean('is_system')->default(false);
            $table->timestamps();
        });

        // 15. Admin Staff Users
        Schema::create('admin_staff', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('password');
            $table->unsignedBigInteger('role_id')->nullable();
            $table->string('role_name')->default('Admin');
            $table->string('status')->default('Active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_staff');
        Schema::dropIfExists('admin_roles');
        Schema::dropIfExists('sent_emails');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('custom_pages');
        Schema::dropIfExists('store_settings');
        Schema::dropIfExists('courier_consignments');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('customer_users');
        Schema::dropIfExists('product_color_variants');
        Schema::dropIfExists('products');
        Schema::dropIfExists('brands');
        Schema::dropIfExists('subcategories');
        Schema::dropIfExists('categories');
    }
};
