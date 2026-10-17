<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// 1. If vendor exists, run full Laravel
if (file_exists(__DIR__.'/../vendor/autoload.php')) {
    if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
        require $maintenance;
    }
    require __DIR__.'/../vendor/autoload.php';
    /** @var Application $app */
    $app = require_once __DIR__.'/../bootstrap/app.php';
    $app->handleRequest(Request::capture());
    exit;
}

// 2. Safe Fallback: Serve the compiled React application directly without 500 error!
if (file_exists(__DIR__ . '/index.html')) {
    readfile(__DIR__ . '/index.html');
    exit;
}

if (file_exists(__DIR__ . '/../index.html')) {
    readfile(__DIR__ . '/../index.html');
    exit;
}

echo "<h1>Somadhan Point is Loading...</h1>";
