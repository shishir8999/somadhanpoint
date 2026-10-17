<?php
/**
 * Somadhan Point - Automatic Database Setup & Migration Script
 * Automatically sets up all tables and initial data for somadha1_somadhan
 */

header('Content-Type: text/html; charset=utf-8');

// Load environment variables from .env if present
$envFile = __DIR__ . '/.env';
if (!file_exists($envFile)) {
    $envFile = __DIR__ . '/../.env';
}

$dbHost = '127.0.0.1';
$dbPort = '3306';
$dbName = 'somadha1_somadhan';
$dbUser = 'somadha1_somadhan';
$dbPass = '37Ck!2ok:HMSt5';

if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($key, $val) = explode('=', $line, 2);
            $key = trim($key);
            $val = trim(trim($val), '"\'');
            if ($key === 'DB_HOST') $dbHost = $val;
            if ($key === 'DB_PORT') $dbPort = $val;
            if ($key === 'DB_DATABASE') $dbName = $val;
            if ($key === 'DB_USERNAME') $dbUser = $val;
            if ($key === 'DB_PASSWORD') $dbPass = $val;
        }
    }
}

// Find SQL file
$sqlFile = __DIR__ . '/somadha1_somadhan.sql';
if (!file_exists($sqlFile)) {
    $sqlFile = __DIR__ . '/../somadha1_somadhan.sql';
}
if (!file_exists($sqlFile)) {
    $sqlFile = __DIR__ . '/somadhanpoint.sql';
}
if (!file_exists($sqlFile)) {
    $sqlFile = __DIR__ . '/../somadhanpoint.sql';
}

$error = null;
$success = null;
$createdTables = [];

if (isset($_POST['run_import'])) {
    try {
        $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
        $pdo = new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]);

        if (!file_exists($sqlFile)) {
            throw new Exception("SQL ফাইলটি পাওয়া যায়নি: " . htmlspecialchars($sqlFile));
        }

        $sql = file_get_contents($sqlFile);
        if (empty($sql)) {
            throw new Exception("SQL ফাইলটি খালি!");
        }

        // Execute SQL script
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
        $pdo->exec($sql);
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

        // Fetch tables list
        $stmt = $pdo->query("SHOW TABLES");
        $createdTables = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $success = "অভিনন্দন! ডাটাবেজ '{$dbName}'-তে সফলভাবে সকল টেবিল (" . count($createdTables) . " টি) ও ডাটা ইমপোর্ট সম্পন্ন হয়েছে।";
    } catch (Exception $e) {
        $error = "ডাটাবেজ সংযোগ বা ইমপোর্টে ত্রুটি: " . $e->getMessage();
    }
} else {
    // Check current connection and existing tables
    try {
        $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
        $pdo = new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]);
        $stmt = $pdo->query("SHOW TABLES");
        $createdTables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    } catch (Exception $e) {
        // Just report for info
    }
}
?>
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Setup - সমাধান পয়েন্ট</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: #f1f5f9; color: #1e293b; margin: 0; padding: 30px 15px; }
        .container { max-width: 680px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e2e8f0; }
        .header { background: #990000; color: #fff; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
        .header p { margin: 6px 0 0; font-size: 14px; opacity: 0.9; }
        .content { padding: 24px; }
        .alert { padding: 14px 18px; border-radius: 8px; font-size: 14px; margin-bottom: 20px; line-height: 1.5; }
        .alert-success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; font-weight: 600; }
        .alert-error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
        .alert-info { background: #f8fafc; color: #334155; border: 1px solid #e2e8f0; font-size: 13px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
        .info-row span:first-child { color: #64748b; font-weight: 500; }
        .info-row span:last-child { color: #0f172a; font-weight: 600; font-family: monospace; }
        .btn { display: inline-block; width: 100%; box-sizing: border-box; background: #990000; color: #fff; border: none; padding: 14px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; text-align: center; text-decoration: none; margin-top: 15px; transition: background 0.2s; }
        .btn:hover { background: #800000; }
        .btn-outline { background: #fff; color: #475569; border: 1px solid #cbd5e1; margin-top: 10px; }
        .btn-outline:hover { background: #f8fafc; }
        .table-list { max-height: 220px; overflow-y: auto; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-top: 15px; }
        .table-item { display: inline-block; background: #e2e8f0; color: #334155; font-size: 12px; padding: 4px 10px; border-radius: 6px; margin: 3px; font-family: monospace; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Somadhan Point Database Setup</h1>
        <p>ডাটাবেজ টেবিল ও ডাটা ইনস্টলেশন টুল</p>
    </div>
    <div class="content">
        <?php if ($success): ?>
            <div class="alert alert-success">
                ✅ <?= htmlspecialchars($success) ?>
            </div>
        <?php elseif ($error): ?>
            <div class="alert alert-error">
                ❌ <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <div class="alert alert-info">
            <div class="info-row"><span>ডাটাবেজ নাম (Database):</span> <span><?= htmlspecialchars($dbName) ?></span></div>
            <div class="info-row"><span>ইউজারনেম (Username):</span> <span><?= htmlspecialchars($dbUser) ?></span></div>
            <div class="info-row"><span>হোস্ট (Host):</span> <span><?= htmlspecialchars($dbHost) ?>:<?= htmlspecialchars($dbPort) ?></span></div>
            <div class="info-row"><span>SQL ফাইল:</span> <span><?= htmlspecialchars(basename($sqlFile)) ?> (<?= file_exists($sqlFile) ? round(filesize($sqlFile)/1024, 1).' KB' : 'ফাইল পাওয়া যায়নি' ?>)</span></div>
            <div class="info-row"><span>বর্তমান টেবিল সংখ্যা:</span> <span><?= count($createdTables) ?> টি টেবিল</span></div>
        </div>

        <?php if (!empty($createdTables)): ?>
            <div style="font-size: 13px; font-weight: 600; color: #475569; margin-top: 15px;">
                ডাটাবেজের বর্তমান টেবিলসমূহ (<?= count($createdTables) ?>):
            </div>
            <div class="table-list">
                <?php foreach ($createdTables as $t): ?>
                    <span class="table-item"><?= htmlspecialchars($t) ?></span>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <form method="POST" onsubmit="return confirm('আপনি কি somadha1_somadhan ডাটাবেজে সকল টেবিল ও ডাটা ইনস্টল/আপডেট করতে চান?');">
            <button type="submit" name="run_import" class="btn">
                ⚡ somadha1_somadhan ডাটাবেজে সকল টেবিল ইনস্টল করুন
            </button>
        </form>

        <a href="/" class="btn btn-outline">🏠 ওয়েবসাইট ভিজিট করুন</a>
    </div>
</div>
</body>
</html>
