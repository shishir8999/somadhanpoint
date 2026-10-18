<?php
/**
 * Somadhan Point - One-Click Database Migration & Setup Tool for cPanel / Webuzo
 * Imports complete database schema, tables and initial data into MySQL automatically.
 */

header('Content-Type: text/html; charset=utf-8');

// 1. Locate .env file
$envPaths = [
    __DIR__ . '/.env',
    __DIR__ . '/../.env',
    dirname(__DIR__) . '/.env',
];

$envConfig = [];
$foundEnv = null;
foreach ($envPaths as $path) {
    if (file_exists($path)) {
        $foundEnv = $path;
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || strpos($line, '#') === 0) continue;
            if (strpos($line, '=') !== false) {
                list($key, $val) = explode('=', $line, 2);
                $key = trim($key);
                $val = trim($val);
                $val = trim($val, '"\'');
                $envConfig[$key] = $val;
            }
        }
        break;
    }
}

// Default credentials from .env or fallback to user's cPanel config
$dbHost = isset($_POST['db_host']) ? trim($_POST['db_host']) : ($envConfig['DB_HOST'] ?? '127.0.0.1');
$dbPort = isset($_POST['db_port']) ? trim($_POST['db_port']) : ($envConfig['DB_PORT'] ?? '3306');
$dbName = isset($_POST['db_name']) ? trim($_POST['db_name']) : ($envConfig['DB_DATABASE'] ?? 'somadha1_somadhan');
$dbUser = isset($_POST['db_user']) ? trim($_POST['db_user']) : ($envConfig['DB_USERNAME'] ?? 'somadha1_somadhan');
$dbPass = isset($_POST['db_pass']) ? trim($_POST['db_pass']) : ($envConfig['DB_PASSWORD'] ?? '37Ck!2ok:HMSt5');

$resultMessage = null;
$resultType = null;
$createdTables = [];

// Locate somadhanpoint.sql
$sqlPaths = [
    __DIR__ . '/somadhanpoint.sql',
    __DIR__ . '/public/somadhanpoint.sql',
    dirname(__DIR__) . '/somadhanpoint.sql',
    dirname(__DIR__) . '/public/somadhanpoint.sql',
];
$sqlFile = null;
foreach ($sqlPaths as $sp) {
    if (file_exists($sp) && filesize($sp) > 500) {
        $sqlFile = $sp;
        break;
    }
}

// If form submitted or triggered automatically via Webhook/CLI
$isAuto = isset($_GET['auto']) || (php_sapi_name() === 'cli' && isset($argv) && in_array('auto', $argv));
if (isset($_POST['run_migrate']) || $isAuto) {
    try {
        if (empty($dbName) || empty($dbUser)) {
            throw new Exception("ডাটাবেসের নাম এবং ইউজারনেম আবশ্যক।");
        }

        // Test PDO Connection
        $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
        $pdo = new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_LOCAL_INFILE => true,
        ]);

        // Get SQL dump content
        $sqlContent = null;
        if ($sqlFile && file_exists($sqlFile)) {
            $sqlContent = file_get_contents($sqlFile);
        } else {
            // Try downloading latest sql from github
            $githubSqlUrl = 'https://raw.githubusercontent.com/shishir8999/somadhanpoint/main/somadhanpoint.sql';
            $ch = curl_init($githubSqlUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            $sqlContent = curl_exec($ch);
            curl_close($ch);
            if (empty($sqlContent) || strlen($sqlContent) < 1000) {
                $sqlContent = @file_get_contents($githubSqlUrl);
            }
        }

        if (empty($sqlContent) || strlen($sqlContent) < 500) {
            throw new Exception("somadhanpoint.sql ফাইল পাওয়া যায়নি বা খালি। অনুগ্রহ করে somadhanpoint.sql ফাইলটি আপলোড করুন।");
        }

        // Execute queries
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
        $pdo->exec("SET NAMES utf8mb4;");

        // Split by semicolons at line ends for safe execution
        $queries = preg_split('/;\s*[\r\n]+/', $sqlContent);
        $executedCount = 0;
        foreach ($queries as $query) {
            $query = trim($query);
            if (!empty($query) && strpos($query, '/*') !== 0 && strpos($query, '--') !== 0) {
                try {
                    $pdo->exec($query);
                    $executedCount++;
                } catch (PDOException $qe) {
                    // ignore harmless warnings like table drop on non-existent
                }
            }
        }

        $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");

        // Verify tables
        $stmt = $pdo->query("SHOW TABLES;");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $createdTables = $tables;
        $resultType = 'success';
        $resultMessage = "অভিনন্দন! মোট " . count($tables) . " টি ডাটাবেস টেবিল সফলভাবে '{$dbName}' ডাটাবেসে তৈরি ও সিঙ্ক করা হয়েছে!";

        if ($isAuto) {
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'success' => true,
                'message' => $resultMessage,
                'database' => $dbName,
                'tables_count' => count($tables),
                'tables' => $tables,
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            exit;
        }

    } catch (Exception $e) {
        $resultType = 'error';
        $resultMessage = "মাইগ্রেশনে ত্রুটি: " . $e->getMessage();
        if ($isAuto) {
            header('Content-Type: application/json; charset=utf-8', true, 500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage(),
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
}

// Current database table check
$existingTables = [];
try {
    if (!empty($dbName) && !empty($dbUser)) {
        $testPdo = new PDO("mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ]);
        $existingTables = $testPdo->query("SHOW TABLES;")->fetchAll(PDO::FETCH_COLUMN);
    }
} catch (Exception $e) {
    // ignore
}
?>
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ডাটাবেস মাইগ্রেশন ও টেবিল ইন্সটলার - Somadhan Point</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Hind Siliguri", sans-serif; }
        body { background: #0f172a; color: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .card { background: #1e293b; border-radius: 16px; border: 1px solid #334155; max-width: 650px; width: 100%; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .header { text-align: center; margin-bottom: 24px; }
        .badge { display: inline-block; padding: 4px 12px; background: rgba(153, 0, 0, 0.2); border: 1px solid #990000; color: #f87171; border-radius: 9999px; font-size: 12px; font-weight: 700; margin-bottom: 12px; }
        h1 { font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 8px; }
        p.sub { font-size: 14px; color: #94a3b8; line-height: 1.5; }
        .alert { padding: 16px; border-radius: 10px; margin-bottom: 20px; font-size: 14px; line-height: 1.5; }
        .alert-success { background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #34d399; }
        .alert-error { background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #f87171; }
        .status-box { background: #0f172a; border-radius: 10px; border: 1px solid #334155; padding: 16px; margin-bottom: 20px; font-size: 13px; }
        .status-box strong { color: #ffffff; }
        .status-box ul { margin-left: 20px; margin-top: 8px; color: #38bdf8; }
        .form-group { margin-bottom: 14px; }
        label { display: block; font-size: 12px; font-weight: 600; color: #cbd5e1; margin-bottom: 5px; }
        input[type="text"], input[type="password"] { width: 100%; padding: 10px 14px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #ffffff; font-size: 14px; }
        input[type="text"]:focus, input[type="password"]:focus { outline: none; border-color: #990000; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .btn-submit { width: 100%; padding: 14px; background: linear-gradient(135deg, #b91c1c, #990000); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 14px rgba(153,0,0,0.4); margin-top: 10px; }
        .btn-submit:hover { background: linear-gradient(135deg, #dc2626, #b91c1c); transform: translateY(-1px); }
        .table-list { max-height: 200px; overflow-y: auto; background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 10px; margin-top: 10px; font-size: 12px; font-family: monospace; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; color: #34d399; }
        .footer-links { text-align: center; margin-top: 24px; font-size: 13px; color: #64748b; }
        .footer-links a { color: #f87171; text-decoration: none; font-weight: 600; margin: 0 8px; }
        .footer-links a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <span class="badge">MySQL Database Migration Tool</span>
            <h1>ডাটাবেস টেবিল তৈরি ও মাইগ্রেশন</h1>
            <p class="sub">cPanel / Webuzo phpMyAdmin-এ এক ক্লিকে Somadhan Point-এর সকল ডাটাবেস টেবিল ও সেটিংস তৈরি করুন।</p>
        </div>

        <?php if ($resultMessage): ?>
            <div class="alert alert-<?php echo $resultType; ?>">
                <?php echo htmlspecialchars($resultMessage); ?>
            </div>
        <?php endif; ?>

        <div class="status-box">
            <div><strong>কানেকশন স্ট্যাটাস:</strong> 
                <?php if (count($existingTables) > 0): ?>
                    <span style="color:#10b981; font-weight:bold;">কানেক্টেড (বর্তমানে <?php echo count($existingTables); ?> টি টেবিল বিদ্যমান)</span>
                <?php else: ?>
                    <span style="color:#f59e0b; font-weight:bold;">ডাটাবেস খালি (কোনো টেবিল পাওয়া যায়নি)</span>
                <?php endif; ?>
            </div>
            <div style="margin-top:6px;"><strong>ডাটাবেস নাম:</strong> <code><?php echo htmlspecialchars($dbName); ?></code></div>
            <div><strong>SQL ফাইল স্ট্যাটাস:</strong> 
                <?php if ($sqlFile): ?>
                    <span style="color:#10b981;">somadhanpoint.sql লোড হয়েছে (<?php echo round(filesize($sqlFile)/1024, 1); ?> KB)</span>
                <?php else: ?>
                    <span style="color:#38bdf8;">গিটহাব থেকে সরাসরি লাইভ ডাউনলোড হবে</span>
                <?php endif; ?>
            </div>
        </div>

        <?php if (count($createdTables) > 0 || count($existingTables) > 0): ?>
            <div style="margin-bottom: 20px;">
                <label>তৈরিকৃত ডাটাবেস টেবিলসমূহ (<?php echo count($createdTables) > 0 ? count($createdTables) : count($existingTables); ?> টি):</label>
                <div class="table-list">
                    <?php 
                    $dispTables = count($createdTables) > 0 ? $createdTables : $existingTables;
                    foreach ($dispTables as $t): ?>
                        <div>✔ <?php echo htmlspecialchars($t); ?></div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

        <form method="POST">
            <div class="grid-2">
                <div class="form-group">
                    <label>DB Host</label>
                    <input type="text" name="db_host" value="<?php echo htmlspecialchars($dbHost); ?>" required>
                </div>
                <div class="form-group">
                    <label>DB Port</label>
                    <input type="text" name="db_port" value="<?php echo htmlspecialchars($dbPort); ?>" required>
                </div>
            </div>

            <div class="form-group">
                <label>Database Name (cPanel ডাটাবেসের নাম)</label>
                <input type="text" name="db_name" value="<?php echo htmlspecialchars($dbName); ?>" required>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label>Database Username</label>
                    <input type="text" name="db_user" value="<?php echo htmlspecialchars($dbUser); ?>" required>
                </div>
                <div class="form-group">
                    <label>Database Password</label>
                    <input type="password" name="db_pass" value="<?php echo htmlspecialchars($dbPass); ?>">
                </div>
            </div>

            <button type="submit" name="run_migrate" class="btn-submit">
                🚀 ১-ক্লিকে সকল টেবিল তৈরি ও মাইগ্রেশন করুন
            </button>
        </form>

        <div class="footer-links">
            <a href="/">ওয়েবসাইটে যান</a> •
            <a href="/admin">অ্যাডমিন ড্যাশবোর্ড</a> •
            <a href="/somadhanpoint.sql" download>📥 somadhanpoint.sql ডাউনলোড করুন</a>
        </div>
    </div>
</body>
</html>
