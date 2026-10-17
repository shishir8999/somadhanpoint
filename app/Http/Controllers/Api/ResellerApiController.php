<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ResellerClientSale;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ResellerApiController extends Controller
{
    public function createSale(Request $request): JsonResponse
    {
        $reseller = Auth::user() ?? User::where('role', 'reseller')->first() ?? User::first();

        $clientName = $request->input('clientName');
        $clientPhone = $request->input('clientPhone');
        $clientEmail = $request->input('clientEmail');
        $planId = $request->input('planId');
        $durationDays = (int)$request->input('durationDays', 30);
        $durationLabel = $request->input('durationLabel', '১ মাস (৩০ দিন)');
        $customSellingPrice = (float)$request->input('customSellingPriceBDT', 450);

        $plan = SubscriptionPlan::find($planId);
        $planName = $plan ? $plan->name : 'Subscription Plan';
        
        $discountRate = ($reseller ? (float)$reseller->reseller_discount_percent : 25) / 100;
        $basePrice = $plan ? (float)$plan->price_bdt : 400;
        $wholesaleCost = round($basePrice * (1 - $discountRate));
        $profit = max(0, $customSellingPrice - $wholesaleCost);

        // Check if reseller has sufficient balance
        if ($reseller && $reseller->wallet_balance_bdt < $wholesaleCost) {
            return response()->json([
                'success' => false,
                'message' => 'অপর্যাপ্ত ওয়ালেট ব্যালেন্স! দয়া করে ওয়ালেট রিচার্জ করুন।'
            ], 400);
        }

        $seatKey = 'RESELL-' . strtoupper(Str::random(8));

        $sale = ResellerClientSale::create([
            'reseller_id' => $reseller ? $reseller->id : 1,
            'client_name' => $clientName,
            'client_phone' => $clientPhone,
            'client_email' => $clientEmail,
            'plan_id' => $planId,
            'plan_name' => $planName,
            'duration_days' => $durationDays,
            'duration_label' => $durationLabel,
            'start_date' => now()->toDateString(),
            'expiry_date' => now()->addDays($durationDays)->toDateString(),
            'seat_key' => $seatKey,
            'wholesale_cost_bdt' => $wholesaleCost,
            'selling_price_bdt' => $customSellingPrice,
            'profit_bdt' => $profit,
            'status' => 'active',
            'credentials_or_url' => "Portal: https://nexusai.hub | Key: {$seatKey}",
        ]);

        // Deduct from reseller's wallet
        if ($reseller) {
            $reseller->decrement('wallet_balance_bdt', $wholesaleCost);
        }

        return response()->json([
            'success' => true,
            'message' => 'গ্রাহকের জন্য সফলভাবে সিট কি ও সাবস্ক্রিপশন জেনারেট হয়েছে!',
            'sale' => $sale,
            'remainingBalance' => $reseller ? $reseller->wallet_balance_bdt : 0
        ]);
    }
}
