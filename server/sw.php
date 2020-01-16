<?php
header("Content-Type: application/javascript");
header("Cache-Control: no-store, no-cache, must-revalidate");
$files = [
	"/css/app.css",
	"/css/chunk-vendors.css",
	"/js/app.js",
	"/js/chunk-vendors.js",
	];

echo "var updated = {};\n";
forEach($files as $file) {
	echo "updated['$file'] = '" . gmdate("D, d M Y H:i:s \G\M\T", filemtime(__DIR__ . $file)) . "';\n";
}
echo "\n\n";
readfile('sw.js');
?>
