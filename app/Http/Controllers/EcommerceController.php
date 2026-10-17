<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\CourierConsignment;
use App\Models\CustomPage;
use App\Models\CustomerUser;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductColorVariant;
use App\Models\SentEmail;
use App\Models\StoreSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class EcommerceController extends Controller
{
    /**
     * Render the main storefront with all data
     */
    public function index(Request $request)
    {
        $products = Product::with('colorVariants')->get();
        $categories = Category::with('subcategories')->get();
        $brands = Brand::all();
        $settings = StoreSetting::current();
        $customPages = CustomPage::where('is_active', true)->get();

        return Inertia::render('EcommerceApp', [
            'dbProducts' => $products,
            'dbCategories' => $categories,
            'dbBrands' => $brands,
            'dbSettings' => $settings,
            'dbCustomPages' => $customPages,
        ]);
    }

    /**
     * Create a new Order in MySQL
     */
    public function placeOrder(Request $request)
    {
        $validated = $request->validate([
            'customerName' => 'required|string',
            'customerPhone' => 'required|string',
            'customerAddress' => 'required|string',
            'deliveryArea' => 'required|string',
            'deliveryFee' => 'numeric',
            'paymentMethod' => 'string',
            'items' => 'required|array',
            'subtotal' => 'numeric',
            'discount' => 'numeric',
            'total' => 'numeric',
            'notes' => 'nullable|string',
        ]);

        $orderId = (string) rand(10000, 99999);
        $orderNumber = $orderId;

        $order = Order::create([
            'id' => $orderId,
            'order_number' => $orderNumber,
            'customer_name' => $validated['customerName'],
            'customer_phone' => $validated['customerPhone'],
            'customer_address' => $validated['customerAddress'],
            'delivery_area' => $validated['deliveryArea'] ?? 'dhaka',
            'delivery_fee' => $validated['deliveryFee'] ?? 80,
            'payment_method' => $validated['paymentMethod'] ?? 'cod',
            'subtotal' => $validated['subtotal'] ?? 0,
            'discount' => $validated['discount'] ?? 0,
            'total' => $validated['total'] ?? 0,
            'status' => 'Pending',
            'notes' => $validated['notes'] ?? '',
        ]);

        foreach ($validated['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product']['id'] ?? null,
                'product_name' => $item['product']['name'] ?? 'Product',
                'quantity' => $item['quantity'] ?? 1,
                'unit_price' => $item['unitPrice'] ?? 0,
                'selected_color' => $item['selectedColor'] ?? null,
                'selected_size' => $item['selectedSize'] ?? null,
                'selected_image' => $item['selectedImage'] ?? null,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে!',
            'order' => $order->load('items'),
        ]);
    }

    /**
     * Track Order by Phone or Order ID
     */
    public function trackOrder($query)
    {
        $clean = trim($query);
        $order = Order::with('items', 'consignment')
            ->where('id', $clean)
            ->orWhere('order_number', $clean)
            ->orWhere('customer_phone', $clean)
            ->latest()
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'কোনো অর্ডার খুঁজে পাওয়া যায়নি। অনুগ্রহ করে সঠিক অর্ডার নাম্বার বা ফোন নাম্বার দিন।',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'order' => $order,
        ]);
    }

    /**
     * Dispatch order to courier
     */
    public function dispatchCourier(Request $request)
    {
        $validated = $request->validate([
            'orderId' => 'required|string',
            'courier' => 'required|string', // Steadfast, Pathao, RedX
        ]);

        $order = Order::findOrFail($validated['orderId']);
        $courier = $validated['courier'];
        $prefix = $courier === 'Steadfast' ? 'STF' : ($courier === 'Pathao' ? 'PTH' : 'RDX');
        $random = rand(100000, 999999);
        $trackingCode = "{$prefix}-{$order->order_number}";
        $consignmentId = "CID-{$random}";

        $trackingUrl = match ($courier) {
            'Steadfast' => "https://steadfast.com.bd/t/{$trackingCode}",
            'Pathao' => "https://merchant.pathao.com/tracking?consignment_id={$trackingCode}",
            default => "https://redx.com.bd/track-order/{$trackingCode}",
        };

        $consignment = CourierConsignment::updateOrCreate(
            ['order_id' => $order->id],
            [
                'id' => "c-{$order->id}-" . time(),
                'order_number' => $order->order_number,
                'courier' => $courier,
                'consignment_id' => $consignmentId,
                'tracking_code' => $trackingCode,
                'tracking_url' => $trackingUrl,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'customer_address' => $order->customer_address,
                'cod_amount' => $order->total,
                'delivery_charge' => $order->delivery_fee,
                'status' => 'In Transit',
                'dispatched_at' => now()->toDayDateTimeString(),
            ]
        );

        $order->update([
            'status' => 'In Transit',
            'courier' => $courier,
            'courier_tracking_code' => $trackingCode,
        ]);

        return response()->json([
            'success' => true,
            'message' => "{$courier} কুরিয়ারে সফলভাবে বুক করা হয়েছে! ট্র্যাকিং কোড: {$trackingCode}",
            'consignment' => $consignment,
            'order' => $order,
        ]);
    }
}
