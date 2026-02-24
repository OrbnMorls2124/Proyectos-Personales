<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

foreach(App\Models\Fixture::all() as $f) {
    echo $f->id . ": " . $f->status_short . " (" . $f->status_long . ") " . $f->home_score . "-" . $f->away_score . " | " . $f->date . "\n";
}
