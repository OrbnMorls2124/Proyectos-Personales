<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Checking CL (2001) for today with full details...\n";

$response = Http::withHeaders([
    'X-Auth-Token' => config('services.football_data.key'),
])->get("https://api.football-data.org/v4/competitions/CL/matches", [
    'dateFrom' => date('Y-m-d'),
    'dateTo' => date('Y-m-d')
]);

if ($response->successful()) {
    $data = $response->json();
    echo "CL Matches found: " . count($data['matches']) . "\n";
    foreach($data['matches'] as $match) {
        echo "Match ID: " . $match['id'] . "\n";
        echo "Teams: " . $match['homeTeam']['name'] . " vs " . $match['awayTeam']['name'] . "\n";
        echo "Status: " . $match['status'] . "\n";
        echo "Date (UTC): " . $match['utcDate'] . "\n";
        echo "Score: " . ($match['score']['fullTime']['home'] ?? '-') . " - " . ($match['score']['fullTime']['away'] ?? '-') . "\n";
        echo "--------------------------\n";
    }
} else {
    echo "Error: " . $response->status() . " - " . $response->body() . "\n";
}
