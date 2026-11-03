<?php
/**
 * product.php - Dynamic Server-Side Open Graph & WhatsApp Link Preview Handler
 * Dharani Herbals
 *
 * Provides dynamic server-side Open Graph metadata for social media crawlers
 * (WhatsApp, Facebook, Twitter, Telegram, LinkedIn) when pre-rendered static
 * files are either being updated or for newly added products.
 */

$productId = isset($_GET['id']) ? preg_replace('/[^0-9]/', '', $_GET['id']) : '';

$siteDomain = 'https://www.dharaniherbbals.in';
$siteName = 'Dharani Herbals';
$defaultImage = $siteDomain . '/logo.png';
$defaultTitle = 'Dharani Herbals | Authentic Siddha & Herbal Products';
$defaultDesc = 'Discover 100% authentic South Indian herbal products, botanical hair care, natural skincare, and traditional wellness formulations from Dharani Herbals.';

$product = null;

if (!empty($productId)) {
    // 1. Try to read from local liveProductsCache.json if present
    $cacheFile = __DIR__ . '/src/data/liveProductsCache.json';
    if (!file_exists($cacheFile)) {
        $cacheFile = __DIR__ . '/liveProductsCache.json';
    }
    
    if (file_exists($cacheFile)) {
        $json = @file_get_contents($cacheFile);
        if ($json) {
            $data = json_decode($json, true);
            if (is_array($data)) {
                foreach ($data as $item) {
                    if (isset($item['id']) && (string)$item['id'] === (string)$productId) {
                        $product = $item;
                        break;
                    }
                }
            }
        }
    }

    // 2. If not found in cache, fetch directly from backend API
    if (!$product) {
        $apiUrl = 'https://api.codingboss.in/products/' . $productId . '/';
        $ctx = stream_context_create([
            'http' => [
                'timeout' => 3,
                'header' => "User-Agent: DharaniBot/1.0\r\n"
            ]
        ]);
        $res = @file_get_contents($apiUrl, false, $ctx);
        if ($res) {
            $p = json_decode($res, true);
            if (is_array($p) && !empty($p['name'])) {
                $product = $p;
            }
        }
    }
}

if ($product) {
    $rawName = isset($product['name']) ? $product['name'] : 'Herbal Product';
    // Clean display suffixes like (GC), (PO), (JAR), (NR), and standardize spellings
    $cleanName = preg_replace('/\bMulthani\s+Metti\b/i', 'Multani Mitti', $rawName);
    $cleanName = preg_replace('/\bMulthani\b/i', 'Multani', $cleanName);
    $cleanName = preg_replace('/\bMetti\b/i', 'Mitti', $cleanName);
    $cleanName = preg_replace('/\b(Orange|Lemon)\s+Peal\b/i', '$1 Peel', $cleanName);
    $cleanName = preg_replace('/\s*\((?:GC|PO|JAR|NR|G|பா|பொ|ஜார்|பாக்கெட்)\)\s*/iu', ' ', $cleanName);
    $cleanName = preg_replace('/\s*\(PO\d*\)?\s*/i', ' ', $cleanName);
    $cleanName = preg_replace('/\bJar\s*\(NR\)/i', ' ', $cleanName);
    $cleanName = preg_replace('/\bJAR\s*(?=\()/i', ' ', $cleanName);
    $cleanName = preg_replace('/\s+\(G\)$/i', '', $cleanName);
    $cleanName = preg_replace('/\s+(?:Nr|NR)$/i', '', $cleanName);
    $cleanName = preg_replace('/\s+பா$/u', '', $cleanName);
    $cleanName = trim(preg_replace('/\s+/', ' ', $cleanName));

    $price = isset($product['price']) ? (float)$product['price'] : 0;
    $priceFormatted = $price > 0 ? '₹' . number_format($price, 0) : '';

    $title = $priceFormatted ? "{$cleanName} - {$priceFormatted} | {$siteName}" : "{$cleanName} | {$siteName}";
    $rawDesc = isset($product['description']) ? trim(strip_tags($product['description'])) : '';
    $rawDesc = preg_replace('/_x000D_/', '', $rawDesc);
    $rawDesc = preg_replace('/\s+/', ' ', $rawDesc);

    $desc = $rawDesc ? mb_substr($rawDesc, 0, 160) : "Explore {$cleanName} from Dharani Herbals. 100% authentic natural Siddha formulation.";
    if ($priceFormatted) {
        $desc = "Price: {$priceFormatted}. " . $desc;
    }

    $image = !empty($product['image']) ? $product['image'] : $defaultImage;
    if (strpos($image, 'http') !== 0) {
        $image = $siteDomain . '/' . ltrim($image, '/');
    }
    // Clean redundant double slashes
    $image = preg_replace('#([^:])//+#', '$1/', $image);

    $canonicalUrl = "{$siteDomain}/product/{$productId}";
} else {
    $title = $defaultTitle;
    $desc = $defaultDesc;
    $image = $defaultImage;
    $canonicalUrl = !empty($productId) ? "{$siteDomain}/product/{$productId}" : $siteDomain;
}

// Clean HTML output for crawlers and browsers
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?php echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8'); ?></title>
  <meta name="description" content="<?php echo htmlspecialchars($desc, ENT_QUOTES, 'UTF-8'); ?>" />
  <link rel="canonical" href="<?php echo htmlspecialchars($canonicalUrl, ENT_QUOTES, 'UTF-8'); ?>" />

  <!-- Open Graph / WhatsApp Preview Tags -->
  <meta property="og:type" content="product" />
  <meta property="og:site_name" content="<?php echo htmlspecialchars($siteName, ENT_QUOTES, 'UTF-8'); ?>" />
  <meta property="og:title" content="<?php echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8'); ?>" />
  <meta property="og:description" content="<?php echo htmlspecialchars($desc, ENT_QUOTES, 'UTF-8'); ?>" />
  <meta property="og:url" content="<?php echo htmlspecialchars($canonicalUrl, ENT_QUOTES, 'UTF-8'); ?>" />
  <meta property="og:image" content="<?php echo htmlspecialchars($image, ENT_QUOTES, 'UTF-8'); ?>" />
  <meta property="og:image:secure_url" content="<?php echo htmlspecialchars($image, ENT_QUOTES, 'UTF-8'); ?>" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="800" />
  <meta property="og:image:height" content="800" />
  <meta property="og:image:alt" content="<?php echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8'); ?>" />
  <meta property="og:locale" content="en_IN" />
  <link rel="image_src" href="<?php echo htmlspecialchars($image, ENT_QUOTES, 'UTF-8'); ?>" />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="<?php echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8'); ?>" />
  <meta name="twitter:description" content="<?php echo htmlspecialchars($desc, ENT_QUOTES, 'UTF-8'); ?>" />
  <meta name="twitter:image" content="<?php echo htmlspecialchars($image, ENT_QUOTES, 'UTF-8'); ?>" />

  <!-- Client-Side Redirect for standard browsers -->
  <script>
    // If not a crawler, smoothly redirect to client-side app
    if (!/bot|crawler|spider|facebook|whatsapp|twitter|telegram/i.test(navigator.userAgent)) {
      window.location.replace("<?php echo htmlspecialchars($canonicalUrl, ENT_QUOTES, 'UTF-8'); ?>");
    }
  </script>
</head>
<body>
  <div style="font-family: system-ui, sans-serif; padding: 40px 20px; text-align: center; color: #1e293b;">
    <h1><?php echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8'); ?></h1>
    <p><?php echo htmlspecialchars($desc, ENT_QUOTES, 'UTF-8'); ?></p>
    <?php if ($image): ?>
      <img src="<?php echo htmlspecialchars($image, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8'); ?>" style="max-width: 320px; border-radius: 12px; margin-top: 16px;" />
    <?php endif; ?>
    <p style="margin-top: 24px;"><a href="<?php echo htmlspecialchars($canonicalUrl, ENT_QUOTES, 'UTF-8'); ?>" style="color: #10b981; font-weight: 700;">Click here to view on Dharani Herbals</a></p>
  </div>
</body>
</html>
