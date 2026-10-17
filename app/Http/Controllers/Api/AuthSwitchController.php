<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthSwitchController extends Controller
{
    public function switchUser(Request $request): JsonResponse
    {
        $userId = $request->input('userId');
        $user = User::find($userId);
        if ($user) {
            Auth::login($user, true);
            return response()->json([
                'success' => true,
                'message' => "{$user->name} হিসেবে সফলভাবে লগইন হয়েছে!",
                'user' => $user
            ]);
        }

        return response()->json(['success' => false, 'message' => 'ইউজার পাওয়া যায়নি।'], 404);
    }

    public function login(Request $request): JsonResponse
    {
        $identifier = trim($request->input('identifier', ''));
        $password = $request->input('password');

        $user = User::where('email', $identifier)
            ->orWhere('phone', $identifier)
            ->first();

        if ($user) {
            // If password provided and set, check password; or allow demo login
            if (!empty($password) && !empty($user->password)) {
                if (!Hash::check($password, $user->password) && $password !== 'admin123456' && $password !== 'user123456') {
                    return response()->json(['success' => false, 'message' => 'পাসওয়ার্ড সঠিক নয়।'], 401);
                }
            }

            Auth::login($user, true);
            return response()->json([
                'success' => true,
                'message' => "স্বাগতম {$user->name}! সফলভাবে লগইন হয়েছে।",
                'user' => $user
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'কোন অ্যাকাউন্ট খুঁজে পাওয়া যায়নি। আপনার তথ্য যাচাই করুন অথবা সাইনআপ করুন।'
        ], 404);
    }

    public function register(Request $request): JsonResponse
    {
        $name = $request->input('name');
        $email = strtolower(trim($request->input('email', '')));
        $phone = $request->input('phone');
        $password = $request->input('password', 'secret123');
        $role = $request->input('role', 'user');

        if (User::where('email', $email)->exists()) {
            return response()->json(['success' => false, 'message' => 'এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে।'], 422);
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'password' => Hash::make($password),
            'role' => in_array($role, ['user', 'reseller']) ? $role : 'user',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            'wallet_balance_bdt' => $role === 'reseller' ? 10000.00 : 0.00,
            'reseller_discount_percent' => $role === 'reseller' ? 25.00 : 0.00,
            'joined_at' => now(),
        ]);

        Auth::login($user, true);

        return response()->json([
            'success' => true,
            'message' => 'নতুন অ্যাকাউন্ট সফলভাবে তৈরি ও লগইন হয়েছে!',
            'user' => $user
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        return response()->json([
            'success' => true,
            'message' => 'সফলভাবে লগআউট হয়েছে।'
        ]);
    }
}
