<?php

use App\Http\Controllers\Api\EcommerceApiController;
use App\Http\Controllers\EcommerceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes for Somadhan Point E-Commerce
|--------------------------------------------------------------------------
|
| Permanent Database & File Persistent Endpoints
|
*/

// 1. Store Settings (Permanent Save & Load)
Route::get('/settings', [EcommerceApiController::class, 'getSettings']);
Route::post('/settings', [EcommerceApiController::class, 'saveSettings']);

// 2. Products
Route::get('/products', [EcommerceApiController::class, 'getProducts']);
Route::post('/products/sync', [EcommerceApiController::class, 'syncProducts']);
Route::delete('/products/{id}', [EcommerceApiController::class, 'deleteProduct']);

// 3. Categories
Route::get('/categories', [EcommerceApiController::class, 'getCategories']);
Route::post('/categories/sync', [EcommerceApiController::class, 'syncCategories']);
Route::delete('/categories/{id}', [EcommerceApiController::class, 'deleteCategory']);

// 4. Brands
Route::get('/brands', [EcommerceApiController::class, 'getBrands']);
Route::post('/brands/sync', [EcommerceApiController::class, 'syncBrands']);
Route::delete('/brands/{id}', [EcommerceApiController::class, 'deleteBrand']);

// 5. Orders & Checkout
Route::get('/orders', [EcommerceApiController::class, 'getOrders']);
Route::post('/orders/sync', [EcommerceApiController::class, 'syncOrders']);
Route::post('/orders/place', [EcommerceController::class, 'placeOrder']);
Route::get('/orders/track/{query}', [EcommerceController::class, 'trackOrder']);
Route::post('/courier/dispatch', [EcommerceController::class, 'dispatchCourier']);

// 6. Order Settings
Route::get('/order-settings', [EcommerceApiController::class, 'getOrderSettings']);
Route::post('/order-settings', [EcommerceApiController::class, 'saveOrderSettings']);

// 7. Custom Pages
Route::get('/custom-pages', [EcommerceApiController::class, 'getCustomPages']);
Route::post('/custom-pages/sync', [EcommerceApiController::class, 'syncCustomPages']);
