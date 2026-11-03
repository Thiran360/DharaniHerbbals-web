<?php
/**
 * api_proxy.php - High Performance, Secure HTTPS Reverse Proxy for Dharani Herbals
 * Routes: https://vedanmart.com/api/* -> http://179.197.251.47:30080/herbal/*
 * 
 * Solves Browser Mixed Content restrictions (HTTPS to HTTP) and Cross-Origin Resource Sharing (CORS).
 */

// 1. Error handling: prevent PHP warnings/notices from corrupting JSON payloads
error_reporting(0);
ini_set('display_errors', '0');

// 2. Handle CORS / Preflight requests cleanly
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, ngrok-skip-browser-warning, Accept, Origin");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Max-Age: 86400");
    http_response_code(200);
    exit(0);
}

// 3. Extract and sanitize route path
$route = '';
if (isset($_GET['__route'])) {
    $route = (string)$_GET['__route'];
} else {
    $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (preg_match('#^/api/(.*)$#i', $requestUri, $matches)) {
        $route = $matches[1];
    }
}

// Strip leading slashes
$route = ltrim($route, '/');

// Security Check: Block directory traversal attempts
if (strpos($route, '..') !== false || strpos($route, '\\') !== false) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'error' => 'Invalid path characters']);
    exit(0);
}

// Security Check: Payload Size limit (10MB max)
$contentLength = isset($_SERVER['CONTENT_LENGTH']) ? (int)$_SERVER['CONTENT_LENGTH'] : 0;
if ($contentLength > 10 * 1024 * 1024) {
    http_response_code(413);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['success' => false, 'error' => 'Payload too large']);
    exit(0);
}

// 4. Construct Backend Target URL
$backendHost = 'http://179.197.251.47:30080';

if (strpos($route, 'media/') === 0) {
    // Media files: http://179.197.251.47:30080/media/...
    $targetUrl = $backendHost . '/' . $route;
} elseif (strpos($route, 'herbal/') === 0) {
    // Already prefixed with herbal/
    $targetUrl = $backendHost . '/' . $route;
} else {
    // API routes: http://179.197.251.47:30080/herbal/...
    $targetUrl = $backendHost . '/herbal/' . $route;
}

// Re-append query parameters if present, excluding internal __route
$queryParams = $_GET;
unset($queryParams['__route']);
if (!empty($queryParams)) {
    $queryString = http_build_query($queryParams);
    $targetUrl .= (strpos($targetUrl, '?') === false ? '?' : '&') . $queryString;
}

// 5. Read incoming request body
$method = strtoupper($_SERVER['REQUEST_METHOD']);
$inputData = null;
if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'])) {
    $inputData = file_get_contents('php://input');
}

// 6. Prepare forwarding headers
$forwardHeaders = [
    'ngrok-skip-browser-warning: true'
];

if (isset($_SERVER['CONTENT_TYPE']) && !empty($_SERVER['CONTENT_TYPE'])) {
    $forwardHeaders[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
} elseif ($inputData !== null && !empty($inputData)) {
    $forwardHeaders[] = 'Content-Type: application/json';
}

if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $forwardHeaders[] = 'Authorization: ' . $_SERVER['HTTP_AUTHORIZATION'];
}

if (isset($_SERVER['HTTP_ACCEPT'])) {
    $forwardHeaders[] = 'Accept: ' . $_SERVER['HTTP_ACCEPT'];
}

// 7. Execute request using cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $targetUrl);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_MAXREDIRS, 3);
curl_setopt($ch, CURLOPT_HTTPHEADER, $forwardHeaders);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

if ($inputData !== null && !empty($inputData)) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $inputData);
}

$response = curl_exec($ch);
$curlError = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

// 8. Handle cURL failures (Backend timeout / unreachable)
if ($response === false || !empty($curlError)) {
    http_response_code(502);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'error' => 'Bad Gateway: Backend connection failure',
        'details' => $curlError
    ]);
    exit(0);
}

// 9. Forward response status code & content type
if ($httpCode) {
    http_response_code($httpCode);
}
if ($contentType) {
    header("Content-Type: $contentType");
} else {
    header('Content-Type: application/json; charset=utf-8');
}

// Output backend response
echo $response;

