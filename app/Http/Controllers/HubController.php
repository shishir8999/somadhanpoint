<?php

namespace App\Http\Controllers;

use App\Models\CustomerReview;
use App\Models\FaqItem;
use App\Models\PaymentOrder;
use App\Models\ResellerClientSale;
use App\Models\SubscriptionPlan;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class HubController extends Controller
{
    public function index(Request $request, string $tab = 'lipika_workspace'): Response
    {
        // 1. Fetch system settings
        $settings = SystemSetting::first();
        if (!$settings) {
            $settings = new SystemSetting([
                'app_name' => 'OmniCraft AI',
                'brand_prefix' => 'OmniCraft',
                'brand_suffix' => 'AI',
                'brand_tagline' => 'All-in-One Smartest AI Workspace & Subscription Hub',
                'brand_tagline_bn' => 'এক ক্লিকে সকল প্রিমিয়াম সাবস্ক্রিপশন ও ওয়ার্কস্পেস',
                'currency' => 'BDT',
                'bdt_to_usd_rate' => 122.00,
            ]);
        }

        // 2. Fetch subscription plans
        $plans = SubscriptionPlan::orderBy('created_at', 'asc')->get()->map(function ($plan) {
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'provider' => $plan->provider,
                'category' => $plan->category,
                'description' => $plan->description,
                'iconName' => $plan->icon_name,
                'imageUrl' => $plan->image_url,
                'badge' => $plan->badge,
                'isOutOfStock' => (bool)$plan->is_out_of_stock,
                'priceBDT' => (float)$plan->price_bdt,
                'priceUSD' => (float)$plan->price_usd,
                'originalPriceBDT' => (float)$plan->original_price_bdt,
                'billingCycle' => $plan->billing_cycle,
                'features' => $plan->features ?? [],
                'accessType' => $plan->access_type,
                'directDomainUrl' => $plan->direct_domain_url ?? '',
                'defaultModelId' => $plan->default_model_id ?? 'chatgpt-4o',
                'availableSeats' => (int)$plan->available_seats,
                'totalSold' => (int)$plan->total_sold,
                'isActive' => (bool)$plan->is_active,
                'brandColor' => $plan->brand_color,
                'credentialsGuide' => $plan->credentials_guide,
            ];
        });

        // 3. Fetch all users
        $allUsers = User::all()->map(function ($u) {
            return [
                'id' => (string)$u->id,
                'name' => $u->name,
                'email' => $u->email,
                'phone' => $u->phone,
                'role' => $u->role,
                'avatar' => $u->avatar ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                'currentPlanId' => $u->current_plan_id,
                'subscriptionStartDate' => $u->subscription_start_date ? $u->subscription_start_date->toISOString() : null,
                'subscriptionExpiry' => $u->subscription_expiry ? $u->subscription_expiry->toISOString() : null,
                'tokenUsage' => (int)$u->token_usage,
                'maxTokens' => (int)$u->max_tokens,
                'activeSeatKey' => $u->active_seat_key,
                'walletBalanceBDT' => (float)$u->wallet_balance_bdt,
                'resellerDiscountPercent' => (float)$u->reseller_discount_percent,
                'joinedAt' => $u->joined_at ? $u->joined_at->toISOString() : $u->created_at->toISOString(),
            ];
        });

        // Current active user: If logged in, use Auth::user(). If guest, provide default customer profile template
        $isLoggedIn = Auth::check();
        $currentUserModel = Auth::user();
        if (!$currentUserModel) {
            $currentUserModel = User::where('role', 'user')->first() ?? User::first();
        }

        $currentUser = null;
        if ($currentUserModel) {
            $currentUser = [
                'id' => (string)$currentUserModel->id,
                'name' => $currentUserModel->name,
                'email' => $currentUserModel->email,
                'phone' => $currentUserModel->phone,
                'role' => $currentUserModel->role,
                'avatar' => $currentUserModel->avatar ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                'currentPlanId' => $currentUserModel->current_plan_id,
                'subscriptionStartDate' => $currentUserModel->subscription_start_date ? $currentUserModel->subscription_start_date->toISOString() : null,
                'subscriptionExpiry' => $currentUserModel->subscription_expiry ? $currentUserModel->subscription_expiry->toISOString() : null,
                'tokenUsage' => (int)$currentUserModel->token_usage,
                'maxTokens' => (int)$currentUserModel->max_tokens,
                'activeSeatKey' => $currentUserModel->active_seat_key,
                'walletBalanceBDT' => (float)$currentUserModel->wallet_balance_bdt,
                'resellerDiscountPercent' => (float)$currentUserModel->reseller_discount_percent,
                'joinedAt' => $currentUserModel->joined_at ? $currentUserModel->joined_at->toISOString() : $currentUserModel->created_at->toISOString(),
            ];
        }

        // 4. Fetch orders
        $orders = PaymentOrder::orderBy('created_at', 'desc')->get()->map(function ($order) {
            return [
                'id' => (string)$order->id,
                'userId' => (string)$order->user_id,
                'userName' => $order->user_name,
                'userEmail' => $order->user_email,
                'planId' => $order->plan_id,
                'planName' => $order->plan_name,
                'amountBDT' => (float)$order->amount_bdt,
                'amountUSD' => (float)$order->amount_usd,
                'method' => $order->method,
                'senderNumber' => $order->sender_number,
                'trxId' => $order->trx_id,
                'status' => $order->status,
                'createdAt' => $order->created_at ? $order->created_at->format('M d, Y h:i A') : '',
                'approvedAt' => $order->approved_at ? $order->approved_at->format('M d, Y h:i A') : null,
                'seatKey' => $order->seat_key ?? '',
                'note' => $order->note,
            ];
        });

        // 5. Fetch Reseller Sales
        $resellerSales = ResellerClientSale::orderBy('created_at', 'desc')->get()->map(function ($s) {
            return [
                'id' => (string)$s->id,
                'resellerId' => (string)$s->reseller_id,
                'clientName' => $s->client_name,
                'clientPhone' => $s->client_phone,
                'clientEmail' => $s->client_email ?? '',
                'planId' => $s->plan_id,
                'planName' => $s->plan_name,
                'durationDays' => (int)$s->duration_days,
                'durationLabel' => $s->duration_label,
                'startDate' => $s->start_date ? $s->start_date->format('Y-m-d') : '',
                'expiryDate' => $s->expiry_date ? $s->expiry_date->format('Y-m-d') : '',
                'seatKey' => $s->seat_key,
                'wholesaleCostBDT' => (float)$s->wholesale_cost_bdt,
                'sellingPriceBDT' => (float)$s->selling_price_bdt,
                'profitBDT' => (float)$s->profit_bdt,
                'status' => $s->status,
                'createdAt' => $s->created_at ? $s->created_at->format('M d, Y') : '',
                'credentialsOrUrl' => $s->credentials_or_url,
            ];
        });

        // 6. Reviews & FAQs
        $reviews = CustomerReview::all();
        $faqs = FaqItem::orderBy('sort_order', 'asc')->get();

        // 7. AI Activation Links
        $activationLinks = \App\Models\AiActivationLink::orderBy('created_at', 'desc')->get()->map(function ($link) {
            return [
                'id' => $link->id,
                'token' => $link->token,
                'serviceType' => $link->service_type,
                'serviceName' => $link->service_name,
                'planId' => $link->plan_id,
                'validityDays' => $link->validity_days,
                'isUsed' => (bool)$link->is_used,
                'usedByEmail' => $link->used_by_email,
                'usedAt' => $link->used_at ? $link->used_at->format('M d, Y h:i A') : null,
                'expiresAt' => $link->expires_at ? $link->expires_at->format('M d, Y') : null,
                'url' => url('/activate/' . $link->token),
                'createdAt' => $link->created_at ? $link->created_at->format('M d, Y') : '',
            ];
        });

        // Check if tab query parameter was supplied
        $requestedTab = $request->query('tab', $tab);

        return Inertia::render('Hub', [
            'initialTab' => $requestedTab,
            'currentUser' => $currentUser,
            'isLoggedIn' => $isLoggedIn,
            'allUsers' => $allUsers,
            'plans' => $plans,
            'orders' => $orders,
            'resellerSales' => $resellerSales,
            'activationLinks' => $activationLinks,
            'settings' => [
                'appName' => $settings->app_name,
                'brandPrefix' => $settings->brand_prefix,
                'brandSuffix' => $settings->brand_suffix,
                'logoUrl' => $settings->logo_url ?? null,
                'brandTagline' => $settings->brand_tagline,
                'brandTaglineBn' => $settings->brand_tagline_bn,
                'announcementText' => $settings->announcement_text ?? '',
                'usaShowcaseTitle' => $settings->usa_showcase_title ?? '',
                'showcaseYoutubeUrl' => $settings->showcase_youtube_url ?? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'badgeText' => $settings->badge_text ?? '',
                'primaryColor' => $settings->primary_color ?? 'blue',
                'logoIcon' => $settings->logo_icon ?? 'Sparkles',
                'customDomain' => $settings->custom_domain ?? 'omnicraft.ai',
                'defaultCreditPercentage' => (float)$settings->default_credit_percentage,
                'bkashMerchant' => $settings->bkash_merchant ?? '01711223344',
                'nagadMerchant' => $settings->nagad_merchant ?? '01811223344',
                'rocketMerchant' => $settings->rocket_merchant ?? '01911223344',
                'upayMerchant' => $settings->upay_merchant ?? '01611223344',
                'autoApprovePayments' => (bool)$settings->auto_approve_payments,
                'currency' => $settings->currency ?? 'BDT',
                'bdtToUsdRate' => (float)$settings->bdt_to_usd_rate,
                'chatgptProxyUrl' => $settings->chatgpt_proxy_url ?? 'https://chatgpt.com',
                'geminiApiKey' => $settings->gemini_api_key ?? '',
                'geminiAccountEmail' => $settings->gemini_account_email ?? '',
                'geminiFamilyInviteUrl' => $settings->gemini_family_invite_url ?? '',
                'openaiApiKey' => $settings->openai_api_key ?? '',
                'claudeApiKey' => $settings->claude_api_key ?? '',
                'grokApiKey' => $settings->grok_api_key ?? '',
                'supportPhone' => $settings->support_phone ?? '+880 1700-000000',
                'supportEmail' => $settings->support_email ?? 'support@nexusai.hub',
                'enableUsaFeaturePage' => (bool)$settings->enable_usa_feature_page,
                'enableInAppChat' => (bool)$settings->enable_in_app_chat,
                'enableDomainProxy' => (bool)$settings->enable_domain_proxy,
                'enableResellerNetwork' => (bool)$settings->enable_reseller_network,
                'enableFloatingChat' => (bool)$settings->enable_floating_chat,
                'enableHeaderMarquee' => (bool)$settings->enable_header_marquee,
                'facebookPixelId' => $settings->facebook_pixel_id ?? '',
                'enableFacebookPixel' => (bool)$settings->enable_facebook_pixel,
            ],
            'reviews' => $reviews,
            'faqs' => $faqs,
        ]);
    }
}
