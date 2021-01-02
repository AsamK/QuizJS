<?php
function printCorsHeaders() {
	if ($_SERVER['HTTP_ORIGIN'] === 'http://localhost:8080') {
		header("Access-Control-Allow-Headers: Content-Type,X-Cookie,Clientdate,Android-Id,Device-Info,Target-Path,Target-Host,Dt,H,W,Hmac");
		header("Access-Control-Expose-Headers: X-Set-Cookie,Set-Cookie");
		header("Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE");
		header("Access-Control-Allow-Origin: http://localhost:8080");
	}
}

$method = $_SERVER['REQUEST_METHOD'];
if ($method === "OPTIONS") {
	printCorsHeaders();
	http_response_code(204);
	die;
}

$host = $_SERVER['HTTP_TARGET_HOST'];

# Check if http request is for valid host
if ($host !== 'qkgermany.feoquizserver.com') {
	http_response_code(403);
	echo "Forbidden";

	die;
}

$path = $_SERVER['HTTP_TARGET_PATH'];

$content_type = $_SERVER['CONTENT_TYPE'];
$content_length = $_SERVER['CONTENT_LENGTH'];

$cookie = $_SERVER['HTTP_X_COOKIE'];
$device_type = $_SERVER['HTTP_DT'];
$device_info = $_SERVER['HTTP_DEVICE_INFO'];
$android_id = $_SERVER['HTTP_ANDROID_ID'];
$clientdate = $_SERVER['HTTP_CLIENTDATE'];
$hmac = $_SERVER['HTTP_HMAC'];
$height = $_SERVER['HTTP_H'];
$width = $_SERVER['HTTP_W'];

$headers = array(
	"Cookie: " . $cookie,
	"Clientdate: " . $clientdate,
	"Dt: " . $device_type,
	"Device-Info: " . $device_info,
	"Android-Id: " . $android_id,
	"Hmac: " . $hmac,
	"H: " . $height,
	"W: " . $width,
);
if ($content_type !== NULL) {
	array_push($headers, "Content-Type: " . $content_type);
}
if ($content_length !== NULL) {
	array_push($headers, "Content-Length: " . $content_length);
}

$input_data = file_get_contents('php://input');

printCorsHeaders();
header("Cache-Control: no-cache");

$url = "https://" . $host . "/" . $path;
$options = array(
	'http' => array(
		'header'  => $headers,
		'method'  => $method,
		'content' => $input_data,
		'ignore_errors' => TRUE,
	)
);
$context  = stream_context_create($options);
$stream = fopen($url, 'r', false, $context);

if ($stream === FALSE) {
	header("Content-Type: text/json");
	http_response_code(500);
	echo '{"message":"Failed to contact remote server"}';
	die;
}

$meta = stream_get_meta_data($stream);
$result = stream_get_contents($stream);
fclose($stream);

for ($i = 0; $i < count($meta['wrapper_data']); $i++) {
	$header = $meta['wrapper_data'][$i];
	if (strpos($header, 'Set-Cookie:') === 0) {
		header('X-' . $header);
	} else {
		header($header);
	}
}

echo $result;
