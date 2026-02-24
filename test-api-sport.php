<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Testing SportAPI (sportapi7)\n";

$response = Http::withHeaders([
    'x-rapidapi-host' => 'sportapi7.p.rapidapi.com',
    'x-rapidapi-key' => config('services.football_api.key'),
])->get("https://sportapi7.p.rapidapi.com/api/v1/football/fixtures/live");

if ($response->successful()) {
    echo "Success! Data found.\n";
    echo $response->body() . "\n";
} else {
    echo "Error: " . $response->status() . " - " . $response->body() . "\n";
}
