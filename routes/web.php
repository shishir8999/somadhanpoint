<?php

use App\Http\Controllers\EcommerceController;
use Illuminate\Support\Facades\Route;

// Main Storefront & Admin Portal via Inertia.js (100% same UI as React app)
Route::get('/', [EcommerceController::class, 'index'])->name('store.home');
Route::get('/products', [EcommerceController::class, 'index'])->name('store.products');
Route::get('/product/{id}', [EcommerceController::class, 'index'])->name('store.product.show');
Route::get('/checkout', [EcommerceController::class, 'index'])->name('store.checkout');
Route::get('/order-tracking', [EcommerceController::class, 'index'])->name('store.tracking');
Route::get('/page/{slug}', [EcommerceController::class, 'index'])->name('store.page');
Route::get('/admin/{section?}', [EcommerceController::class, 'index'])->name('store.admin');

// Backend API Endpoints (MySQL)
Route::prefix('api')->group(function () {
    Route::post('/orders', [EcommerceController::class, 'placeOrder'])->name('api.orders.place');
    Route::get('/orders/track/{query}', [EcommerceController::class, 'trackOrder'])->name('api.orders.track');
    Route::post('/courier/dispatch', [EcommerceController::class, 'dispatchCourier'])->name('api.courier.dispatch');
});
