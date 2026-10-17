<?php

use App\Http\Controllers\Api\AdminApiController;
use App\Http\Controllers\Api\AiChatController;
use App\Http\Controllers\Api\AuthSwitchController;
use App\Http\Controllers\Api\PaymentApiController;
use App\Http\Controllers\Api\ResellerApiController;
use App\Http\Controllers\Api\VaultApiController;
use Illuminate\Support\Facades\Route;

// AI Chat Endpoint (replaces server.ts /api/ai/chat)
Route::post('/ai/chat', [AiChatController::class, 'chat']);

// Payment Verification Endpoint (replaces server.ts /api/payments/verify)
Route::post('/payments/verify', [PaymentApiController::class, 'verify']);

// Admin Endpoints
Route::post('/settings', [AdminApiController::class, 'saveSettings']);
Route::post('/plans', [AdminApiController::class, 'savePlan']);
Route::delete('/plans/{id}', [AdminApiController::class, 'deletePlan']);
Route::post('/orders/{id}/status', [AdminApiController::class, 'updateOrderStatus']);
Route::post('/users/{id}', [AdminApiController::class, 'updateUser']);

// Reseller Endpoints
Route::post('/reseller/sale', [ResellerApiController::class, 'createSale']);

// Vault Endpoints
Route::get('/vault', [VaultApiController::class, 'index']);
Route::post('/vault/upload', [VaultApiController::class, 'upload']);
Route::delete('/vault/{id}', [VaultApiController::class, 'destroy']);

// Auth & Switch User Endpoints
Route::post('/auth/switch-user', [AuthSwitchController::class, 'switchUser']);
Route::post('/auth/login', [AuthSwitchController::class, 'login']);
Route::post('/auth/register', [AuthSwitchController::class, 'register']);
Route::post('/auth/logout', [AuthSwitchController::class, 'logout']);
