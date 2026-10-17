<?php

namespace App\Http\Controllers;

use App\Models\AiActivationLink;
use App\Models\SubscriptionPlan;
use App\Models\SystemSetting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AiActivationController extends Controller
{
    /**
     * Show public activation page for a one-time link
     */
    public function show(string $token)
    {
        $link = AiActivationLink::where('token', $token)->first();

        if (!$link) {
            return Inertia::render('ActivateLink', [
                'isValid' => false,
                'error' => 'invalid',
                'message' => 'এই অ্যাক্টিভেশন লিংকটি সঠিক নয় অথবা ডাটাবেজে পাওয়া যায়নি।',
            ]);
        }

        if ($link->is_used) {
            return Inertia::render('ActivateLink', [
                'isValid' => false,
                'error' => 'already_used',
                'usedByEmail' => $link->used_by_email,
                'usedAt' => $link->used_at ? $link->used_at->format('M d, Y h:i A') : '',
                'serviceName' => $link->service_name,
                'message' => "এই ওয়ান-টাইম অ্যাক্টিভেশন লিংকটি ইতিমধ্যে {$link->used_by_email} জিমেইলে সক্রিয় করা হয়ে গেছে। একটি লিংক কেবল একবারই ব্যবহারযোগ্য।",
            ]);
        }

        // Check expiry if set
        if ($link->expires_at && Carbon::now()->greaterThan($link->expires_at)) {
            return Inertia::render('ActivateLink', [
                'isValid' => false,
                'error' => 'expired',
                'serviceName' => $link->service_name,
                'message' => 'এই অ্যাক্টিভেশন লিংকটির ব্যবহারের সময়সীমা শেষ হয়ে গেছে।',
            ]);
        }

        $settings = SystemSetting::first();

        return Inertia::render('ActivateLink', [
            'isValid' => true,
            'token' => $link->token,
            'serviceType' => $link->service_type,
            'serviceName' => $link->service_name,
            'validityDays' => $link->validity_days,
            'planId' => $link->plan_id,
            'appName' => $settings->app_name ?? 'OmniCraft AI',
            'supportEmail' => $settings->support_email ?? 'support@omnicraft.ai',
        ]);
    }

    /**
     * Process activation by User's Gmail
     */
    public function activate(Request $request, string $token): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'name' => 'nullable|string|max:100',
        ]);

        $email = strtolower(trim($request->input('email')));
        $link = AiActivationLink::where('token', $token)->first();

        if (!$link) {
            return response()->json([
                'success' => false,
                'message' => 'ইনভ্যালিড অ্যাক্টিভেশন লিংক!',
            ], 404);
        }

        if ($link->is_used) {
            return response()->json([
                'success' => false,
                'message' => "এই ওয়ান-টাইম লিংকটি ইতিমধ্যে {$link->used_by_email} দিয়ে অ্যাক্টিভ করা হয়ে গেছে!",
            ], 400);
        }

        // 1. Find or create user with this Gmail
        $user = User::where('email', $email)->first();
        $isNewUser = false;

        if (!$user) {
            $isNewUser = true;
            $name = $request->input('name') ?: explode('@', $email)[0];
            $user = User::create([
                'name' => ucwords(str_replace(['.', '_', '-'], ' ', $name)),
                'email' => $email,
                'password' => Hash::make(Str::random(16)),
                'role' => 'user',
                'joined_at' => Carbon::now(),
            ]);
        }

        // 2. Determine target plan
        $planId = $link->plan_id;
        if (!$planId) {
            $planId = match($link->service_type) {
                'gemini' => 'gemini-advance',
                'chatgpt' => 'chatgpt-plus',
                'claude' => 'claude-pro',
                'grok' => 'chatgpt-plus',
                default => 'gemini-advance',
            };
        }

        // 3. Update User Subscription
        $validityDays = $link->validity_days > 0 ? $link->validity_days : 30;
        $seatKey = strtoupper($link->service_type) . '-ACT-' . strtoupper(Str::random(8));

        $user->current_plan_id = $planId;
        $user->subscription_start_date = Carbon::now();
        $user->subscription_expiry = Carbon::now()->addDays($validityDays);
        $user->active_seat_key = $seatKey;
        $user->max_tokens = 250000;
        $user->save();

        // 4. Mark link as USED and bind to this Gmail
        $link->is_used = true;
        $link->used_by_email = $email;
        $link->used_by_user_id = $user->id;
        $link->used_at = Carbon::now();
        $link->save();

        // 5. Automatically log the user in
        Auth::login($user, true);

        return response()->json([
            'success' => true,
            'message' => "অভিনন্দন! আপনার {$link->service_name} সাবস্ক্রিপশন সফলভাবে {$email} জিমেইলে সক্রিয় করা হয়েছে।",
            'redirect' => '/workspace',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'plan_id' => $user->current_plan_id,
                'expiry' => $user->subscription_expiry->toDateString(),
                'seat_key' => $user->active_seat_key,
            ]
        ]);
    }

    /**
     * Admin: Generate a new one-time activation link
     */
    public function generate(Request $request): JsonResponse
    {
        $request->validate([
            'service_type' => 'required|string|in:gemini,chatgpt,claude,grok,all_in_one',
            'validity_days' => 'required|integer|min:1|max:365',
            'plan_id' => 'nullable|string',
            'note' => 'nullable|string',
        ]);

        $serviceType = $request->input('service_type');
        $validityDays = (int)$request->input('validity_days');

        $names = [
            'gemini' => 'Google Gemini Advanced (AI Pro)',
            'chatgpt' => 'ChatGPT Plus (GPT-4o & Canvas)',
            'claude' => 'Claude 3.5 Sonnet Pro',
            'grok' => 'xAI Grok 2 & Mini',
            'all_in_one' => 'All-in-One AI VIP Bundle',
        ];

        $planIds = [
            'gemini' => 'gemini-advance',
            'chatgpt' => 'chatgpt-plus',
            'claude' => 'claude-pro',
            'grok' => 'chatgpt-plus',
            'all_in_one' => 'lipika-pro',
        ];

        $token = AiActivationLink::generateToken($serviceType);
        $adminId = Auth::check() ? Auth::id() : 1;

        $link = AiActivationLink::create([
            'token' => $token,
            'service_type' => $serviceType,
            'service_name' => $names[$serviceType] ?? 'OmniCraft AI Pro',
            'plan_id' => $request->input('plan_id') ?: ($planIds[$serviceType] ?? 'gemini-advance'),
            'validity_days' => $validityDays,
            'is_used' => false,
            'created_by_admin_id' => $adminId,
            'expires_at' => Carbon::now()->addDays($validityDays + 15), // link validity window
            'access_instructions' => $request->input('note'),
        ]);

        $fullUrl = url('/activate/' . $token);

        return response()->json([
            'success' => true,
            'message' => 'নতুন ওয়ান-টাইম অ্যাক্টিভেশন লিংক সফলভাবে তৈরি হয়েছে!',
            'link' => [
                'id' => $link->id,
                'token' => $link->token,
                'service_type' => $link->service_type,
                'service_name' => $link->service_name,
                'validity_days' => $link->validity_days,
                'is_used' => false,
                'used_by_email' => null,
                'url' => $fullUrl,
                'created_at' => $link->created_at->format('M d, Y h:i A'),
            ]
        ]);
    }

    /**
     * Admin: Save master AI Keys
     */
    public function saveMasterKeys(Request $request): JsonResponse
    {
        $settings = SystemSetting::first();
        if (!$settings) {
            $settings = new SystemSetting();
        }

        if ($request->has('gemini_api_key')) {
            $settings->gemini_api_key = $request->input('gemini_api_key');
        }
        if ($request->has('gemini_account_email')) {
            $settings->gemini_account_email = $request->input('gemini_account_email');
        }
        if ($request->has('gemini_family_invite_url')) {
            $settings->gemini_family_invite_url = $request->input('gemini_family_invite_url');
        }
        if ($request->has('openai_api_key')) {
            $settings->openai_api_key = $request->input('openai_api_key');
        }
        if ($request->has('claude_api_key')) {
            $settings->claude_api_key = $request->input('claude_api_key');
        }
        if ($request->has('grok_api_key')) {
            $settings->grok_api_key = $request->input('grok_api_key');
        }

        $settings->save();

        return response()->json([
            'success' => true,
            'message' => 'মাস্টার এআই কি এবং ক্রেডেনশিয়াল সফলভাবে সংরক্ষণ করা হয়েছে!',
        ]);
    }
}
