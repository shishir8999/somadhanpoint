<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        $settings = \App\Models\SystemSetting::first();
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
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
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();
        if ($user && $user->role === 'super_admin') {
            return redirect()->intended('/admin');
        } elseif ($user && $user->role === 'reseller') {
            return redirect()->intended('/reseller');
        }

        return redirect()->intended('/dashboard');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
