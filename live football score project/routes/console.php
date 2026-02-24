<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Sincronizar datos de fútbol cada 2 minutos para mantener partidos en vivo actualizados
Schedule::command('app:sync-football-data')->everyTwoMinutes();
