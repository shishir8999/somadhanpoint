<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        $settings = SystemSetting::first();
        return Inertia::render('Auth/Login', [
            'initialTab' => 'register',
            'settings' => $settings ? [
                'appName' => $settings->app_name,
                'brandPrefix' => $settings->brand_prefix,
                'brandSuffix' => $settings->brand_suffix,
                'brandTagline' => $settings->brand_tagline,
                'supportPhone' => $settings->support_phone,
                'supportEmail' => $settings->support_email,
                'announcementText' => $settings->announcement_text,
                'enableHeaderMarquee' => (bool)$settings->enable_header_marquee,
            ] : null,
        ]);
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'phone' => 'nullable|string',
            'role' => 'nullable|string|in:user,reseller',
        ]);

        $role = $request->input('role', 'user');

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'role' => in_array($role, ['user', 'reseller']) ? $role : 'user',
            'password' => Hash::make($request->password),
            'wallet_balance_bdt' => $role === 'reseller' ? 10000.00 : 0.00,
            'reseller_discount_percent' => $role === 'reseller' ? 25.00 : 0.00,
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            'joined_at' => now(),
        ]);

        event(new Registered($user));

        Auth::login($user);

        if ($user->role === 'reseller') {
            return redirect('/reseller');
        }

        return redirect('/dashboard');
    }
}
