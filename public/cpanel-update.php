<?php
/**
 * Somadhan Point - One-Click Automatic Live Update Tool
 * Downloads the latest live bundle from GitHub and extracts it to update your website instantly.
 */

header('Content-Type: text/html; charset=utf-8');

$zipUrl = 'https://raw.githubusercontent.com/shishir8999/somadhanpoint/main/somadhanpoint-frontend-live.zip';
$destinationZip = __DIR__ . '/latest-bundle.zip';
$targetDir = __DIR__;

$statusMessage = null;
$statusType = null;

if (isset($_POST['run_deploy'])) {
    try {
        // 1. Download zip from GitHub
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $zipUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'SomadhanPoint-Deployer');
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        $zipData = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200 || empty($zipData)) {
            // Try file_get_contents as fallback
            $zipData = @file_get_contents($zipUrl);
        }

        if (empty($zipData) || strlen($zipData) < 1000) {
            throw new Exception("গিটহাব থেকে সর্বশেষ জিপ ফাইল ডাউনলোড করা যায়নি। অনুগ্রহ করে ম্যানুয়ালি somadhanpoint-frontend-live.zip আপলোড করুন।");
        }

        file_put_contents($destinationZip, $zipData);

        // 2. Extract Zip Archive (Normalized cross-platform extraction)
        $zip = new ZipArchive();
        if ($zip->open($destinationZip) === TRUE) {
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $entryName = $zip->getNameIndex($i);
                $normalized = str_replace('\\', '/', $entryName);

                $targets = [$targetDir . '/' . $normalized];
                if (is_dir($targetDir . '/public')) {
                    $targets[] = $targetDir . '/public/' . $normalized;
                }

                foreach ($targets as $dest) {
                    if (substr($normalized, -1) === '/') {
                        if (!is_dir($dest)) @mkdir($dest, 0755, true);
                    } else {
                        $parent = dirname($dest);
                        if (!is_dir($parent)) @mkdir($parent, 0755, true);
                        $stream = $zip->getStream($entryName);
                        if ($stream) {
                            file_put_contents($dest, stream_get_contents($stream));
                            fclose($stream);
                        }
                    }
                }
            }
            $zip->close();
            @unlink($destinationZip);

            // Cleanup any stray backslash files from previous extractions
            foreach (glob($targetDir . '/assets\\*') ?: [] as $stray) {
                @unlink($stray);
            }

            $statusType = 'success';
            $statusMessage = "অভিনন্দন! আপনার লাইভ ওয়েবসাইটটি সফলভাবে সর্বশেষ মোবাইল-অপ্টিমাইজড ভার্সনে আপডেট হয়েছে। ব্রাউজারে রিফ্রেশ দিয়ে চেক করুন।";
        } else {
            throw new Exception("জিপ ফাইল এক্সট্রাক্ট করা যায়নি। ZipArchive এক্সটেনশন এনাবল আছে কি না চেক করুন।");
        }
    } catch (Exception $e) {
        $statusType = 'error';
        $statusMessage = "আপডেটে ত্রুটি: " . $e->getMessage();
    }
}

// Check current bundle hash from index.html
$currentIndex = $targetDir . '/index.html';
$currentBundle = 'অজানা';
if (file_exists($currentIndex)) {
    $content = file_get_contents($currentIndex);
    if (preg_match('/assets\/(index-[a-zA-Z0-9_-]+\.js)/', $content, $matches)) {
        $currentBundle = $matches[1];
    }
}
?>
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>One-Click Live Website Updater - Somadhan Point</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 30px 15px; }
        .box { max-width: 620px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e2e8f0; }
        .hdr { background: #990000; color: #fff; padding: 22px; text-align: center; }
        .hdr h1 { margin: 0; font-size: 20px; font-weight: 700; }
        .hdr p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
        .body { padding: 24px; }
        .msg { padding: 14px 18px; border-radius: 8px; font-size: 14px; margin-bottom: 20px; line-height: 1.5; font-weight: 600; }
        .msg-success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
        .msg-error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; font-size: 13px; margin-bottom: 20px; }
        .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #edf2f7; }
        .row:last-child { border-bottom: none; }
        .row span:first-child { color: #64748b; }
        .row span:last-child { color: #0f172a; font-weight: 600; font-family: monospace; }
        .btn { display: inline-block; width: 100%; box-sizing: border-box; background: #990000; color: #fff; border: none; padding: 14px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; text-align: center; text-decoration: none; margin-top: 10px; transition: background 0.2s; }
        .btn:hover { background: #800000; }
        .btn-link { background: #f1f5f9; color: #334155; margin-top: 8px; }
        .btn-link:hover { background: #e2e8f0; }
    </style>
</head>
<body>
<div class="box">
    <div class="hdr">
        <h1>Somadhan Point Live Updater</h1>
        <p>১-ক্লিকে সিপ্যানেলে গিটহাবের সর্বশেষ বিল্ড আপডেট করুন</p>
    </div>
    <div class="body">
        <?php if ($statusMessage): ?>
            <div class="msg msg-<?= $statusType ?>">
                <?= $statusType === 'success' ? '✅' : '❌' ?> <?= htmlspecialchars($statusMessage) ?>
            </div>
        <?php endif; ?>

        <div class="card">
            <div class="row">
                <span>বর্তমান সক্রিয় বান্ডেল:</span>
                <span><?= htmlspecialchars($currentBundle) ?></span>
            </div>
            <div class="row">
                <span>আপডেট সোর্স:</span>
                <span>GitHub (main branch)</span>
            </div>
            <div class="row">
                <span>টার্গেট ডিরেক্টরি:</span>
                <span><?= htmlspecialchars($targetDir) ?></span>
            </div>
        </div>

        <form method="POST">
            <button type="submit" name="run_deploy" class="btn">
                ⚡ ১-ক্লিকে সর্বশেষ ভার্সনে আপডেট করুন
            </button>
        </form>

        <a href="/" class="btn btn-link">🏠 ওয়েবসাইট ভিজিট করুন</a>
    </div>
</div>
</body>
</html>
