<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Testing broad date range (last 5 days)\n";

$response = Http::withHeaders([
    'X-Auth-Token' => config('services.football_data.key'),
])->get("https://api.football-data.org/v4/matches", [
    'dateFrom' => date('Y-m-d', strtotime('-4 days')),
    'dateTo' => date('Y-m-d')
]);

if ($response->successful()) {
    $data = $response->json();
    echo "Results count: " . count($data['matches']) . "\n";
    if (count($data['matches']) > 0) {
        foreach($data['matches'] as $match) {
            echo "[" . $match['utcDate'] . "] " . $match['competition']['name'] . ": " . $match['homeTeam']['name'] . " " . ($match['score']['fullTime']['home'] ?? '?') . "-" . ($match['score']['fullTime']['away'] ?? '?') . " " . $match['awayTeam']['name'] . "\n";
        }
    } else {
        echo "No matches found in range.\n";
    }
} else {
    echo "Error: " . $response->status() . " - " . $response->body() . "\n";
}
