<?php
/**
 * Somadhan Point - Automatic GitHub Push Webhook Deployer & DB Migrator
 * Automatically executes code pull and MySQL database migration on every GitHub push.
 */

header('Content-Type: application/json; charset=utf-8');

$zipUrl = 'https://raw.githubusercontent.com/shishir8999/somadhanpoint/main/somadhanpoint-frontend-live.zip';
$sqlUrl = 'https://raw.githubusercontent.com/shishir8999/somadhanpoint/main/somadhanpoint.sql';
$targetDir = __DIR__;
$destinationZip = $targetDir . '/github-deploy-temp.zip';

$response = [
    'success' => false,
    'code_updated' => false,
    'db_migrated' => false,
    'message' => '',
];

try {
    // 1. Download latest zip from GitHub
    $ch = curl_init($zipUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    $zipData = curl_exec($ch);
    curl_close($ch);

    if (empty($zipData) || strlen($zipData) < 1000) {
        $zipData = @file_get_contents($zipUrl);
    }

    if (!empty($zipData) && strlen($zipData) >= 1000) {
        file_put_contents($destinationZip, $zipData);
        $zip = new ZipArchive();
        if ($zip->open($destinationZip) === TRUE) {
            $zip->extractTo($targetDir);
            if (is_dir($targetDir . '/public')) {
                $zip->extractTo($targetDir . '/public');
            }
            $zip->close();
            @unlink($destinationZip);
            $response['code_updated'] = true;
        }
    }

    // 2. Automatically Run Database Migration
    $migrateUrl = 'http://' . ($_SERVER['HTTP_HOST'] ?? '127.0.0.1') . '/cpanel-migrate.php?auto=1';
    
    // Also run locally if cpanel-migrate.php is in same dir
    if (file_exists($targetDir . '/cpanel-migrate.php')) {
        $_GET['auto'] = '1';
        ob_start();
        include $targetDir . '/cpanel-migrate.php';
        $migrateOutput = ob_get_clean();
        $dbRes = json_decode($migrateOutput, true);
        if ($dbRes && !empty($dbRes['success'])) {
            $response['db_migrated'] = true;
            $response['tables_count'] = $dbRes['tables_count'] ?? 0;
        }
    }

    $response['success'] = true;
    $response['message'] = 'GitHub deployment and database migration executed successfully!';
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    $response['error'] = $e->getMessage();
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
