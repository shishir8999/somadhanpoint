<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentOrder;
use App\Models\SubscriptionPlan;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminApiController extends Controller
{
    public function saveSettings(Request $request): JsonResponse
    {
        $settings = SystemSetting::firstOrCreate(['id' => 1]);
        
        $payload = $request->all();
        $mapped = [
            'app_name' => $payload['appName'] ?? $payload['app_name'] ?? $settings->app_name,
            'brand_prefix' => $payload['brandPrefix'] ?? $payload['brand_prefix'] ?? $settings->brand_prefix,
            'brand_suffix' => $payload['brandSuffix'] ?? $payload['brand_suffix'] ?? $settings->brand_suffix,
            'logo_url' => $payload['logoUrl'] ?? $payload['logo_url'] ?? $settings->logo_url,
            'brand_tagline' => $payload['brandTagline'] ?? $payload['brand_tagline'] ?? $settings->brand_tagline,
            'brand_tagline_bn' => $payload['brandTaglineBn'] ?? $payload['brand_tagline_bn'] ?? $settings->brand_tagline_bn,
            'announcement_text' => $payload['announcementText'] ?? $payload['announcement_text'] ?? $settings->announcement_text,
            'usa_showcase_title' => $payload['usaShowcaseTitle'] ?? $payload['usa_showcase_title'] ?? $settings->usa_showcase_title,
            'showcase_youtube_url' => $payload['showcaseYoutubeUrl'] ?? $payload['showcase_youtube_url'] ?? $settings->showcase_youtube_url,
            'badge_text' => $payload['badgeText'] ?? $payload['badge_text'] ?? $settings->badge_text,
            'primary_color' => $payload['primaryColor'] ?? $payload['primary_color'] ?? $settings->primary_color,
            'logo_icon' => $payload['logoIcon'] ?? $payload['logo_icon'] ?? $settings->logo_icon,
            'custom_domain' => $payload['customDomain'] ?? $payload['custom_domain'] ?? $settings->custom_domain,
            'default_credit_percentage' => $payload['defaultCreditPercentage'] ?? $payload['default_credit_percentage'] ?? $settings->default_credit_percentage,
            'bkash_merchant' => $payload['bkashMerchant'] ?? $payload['bkash_merchant'] ?? $settings->bkash_merchant,
            'nagad_merchant' => $payload['nagadMerchant'] ?? $payload['nagad_merchant'] ?? $settings->nagad_merchant,
            'rocket_merchant' => $payload['rocketMerchant'] ?? $payload['rocket_merchant'] ?? $settings->rocket_merchant,
            'upay_merchant' => $payload['upayMerchant'] ?? $payload['upay_merchant'] ?? $settings->upay_merchant,
            'auto_approve_payments' => $payload['autoApprovePayments'] ?? $payload['auto_approve_payments'] ?? $settings->auto_approve_payments,
            'currency' => $payload['currency'] ?? $settings->currency,
            'bdt_to_usd_rate' => $payload['bdtToUsdRate'] ?? $payload['bdt_to_usd_rate'] ?? $settings->bdt_to_usd_rate,
            'chatgpt_proxy_url' => $payload['chatgptProxyUrl'] ?? $payload['chatgpt_proxy_url'] ?? $settings->chatgpt_proxy_url,
            'support_phone' => $payload['supportPhone'] ?? $payload['support_phone'] ?? $settings->support_phone,
            'support_email' => $payload['supportEmail'] ?? $payload['support_email'] ?? $settings->support_email,
            'enable_usa_feature_page' => $payload['enableUsaFeaturePage'] ?? $payload['enable_usa_feature_page'] ?? $settings->enable_usa_feature_page,
            'enable_in_app_chat' => $payload['enableInAppChat'] ?? $payload['enable_in_app_chat'] ?? $settings->enable_in_app_chat,
            'enable_domain_proxy' => $payload['enableDomainProxy'] ?? $payload['enable_domain_proxy'] ?? $settings->enable_domain_proxy,
            'enable_reseller_network' => $payload['enableResellerNetwork'] ?? $payload['enable_reseller_network'] ?? $settings->enable_reseller_network,
            'enable_floating_chat' => $payload['enableFloatingChat'] ?? $payload['enable_floating_chat'] ?? $settings->enable_floating_chat,
            'enable_header_marquee' => $payload['enableHeaderMarquee'] ?? $payload['enable_header_marquee'] ?? $settings->enable_header_marquee,
        ];

        $settings->fill($mapped);
        $settings->save();

        return response()->json([
            'success' => true,
            'message' => 'সিস্টেম সেটিংস সফলভাবে আপডেট হয়েছে।',
            'settings' => $settings
        ]);
    }

    public function savePlan(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => 'required|string',
            'name' => 'required|string',
            'provider' => 'required|string',
            'category' => 'required|string',
            'description' => 'required|string',
            'iconName' => 'nullable|string',
            'imageUrl' => 'nullable|string',
            'badge' => 'nullable|string',
            'isOutOfStock' => 'nullable|boolean',
            'priceBDT' => 'required|numeric',
            'priceUSD' => 'required|numeric',
            'originalPriceBDT' => 'required|numeric',
            'billingCycle' => 'required|string',
            'features' => 'nullable|array',
            'accessType' => 'required|string',
            'directDomainUrl' => 'nullable|string',
            'defaultModelId' => 'nullable|string',
            'availableSeats' => 'nullable|integer',
            'isActive' => 'nullable|boolean',
            'brandColor' => 'nullable|string',
        ]);

        $plan = SubscriptionPlan::updateOrCreate(
            ['id' => $data['id']],
            [
                'name' => $data['name'],
                'provider' => $data['provider'],
                'category' => $data['category'],
                'description' => $data['description'],
                'icon_name' => $data['iconName'] ?? 'Sparkles',
                'image_url' => $data['imageUrl'] ?? null,
                'badge' => $data['badge'] ?? null,
                'is_out_of_stock' => $data['isOutOfStock'] ?? false,
                'price_bdt' => $data['priceBDT'],
                'price_usd' => $data['priceUSD'],
                'original_price_bdt' => $data['originalPriceBDT'],
                'billing_cycle' => $data['billingCycle'],
                'features' => $data['features'] ?? [],
                'access_type' => $data['accessType'],
                'direct_domain_url' => $data['directDomainUrl'] ?? '',
                'default_model_id' => $data['defaultModelId'] ?? 'chatgpt-4o',
                'available_seats' => $data['availableSeats'] ?? 50,
                'is_active' => $data['isActive'] ?? true,
                'brand_color' => $data['brandColor'] ?? '#10A37F',
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'প্ল্যান সফলভাবে সংরক্ষিত হয়েছে।',
            'plan' => $plan
        ]);
    }

    public function deletePlan(string $id): JsonResponse
    {
        SubscriptionPlan::where('id', $id)->delete();
        return response()->json([
            'success' => true,
            'message' => 'প্ল্যান মুছে ফেলা হয়েছে।'
        ]);
    }

    public function updateOrderStatus(Request $request, int $id): JsonResponse
    {
        $status = $request->input('status', 'approved');
        $order = PaymentOrder::findOrFail($id);
        $order->status = $status;
        if ($status === 'approved') {
            $order->approved_at = now();
            if ($order->user && $order->plan) {
                $order->user->current_plan_id = $order->plan_id;
                $order->user->active_seat_key = $order->seat_key;
                $order->user->subscription_expiry = now()->addDays(30);
                $order->user->save();
            }
        }
        $order->save();

        return response()->json([
            'success' => true,
            'message' => "অর্ডারের স্ট্যাটাস '{$status}' এ পরিবর্তন করা হয়েছে।",
            'order' => $order
        ]);
    }

    public function updateUser(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->fill($request->only([
            'name',
            'phone',
            'role',
            'wallet_balance_bdt',
            'reseller_discount_percent',
            'token_usage',
            'max_tokens',
        ]));
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'ইউজার তথ্য আপডেট হয়েছে।',
            'user' => $user
        ]);
    }
}
