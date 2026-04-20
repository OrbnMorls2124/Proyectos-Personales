<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\FootballDataService;

class SyncFootballData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-football-data {--live : Sync live fixtures only}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync football leagues and fixtures from Football-Data.org';

    /**
     * Execute the console command.
     */
    public function handle(FootballDataService $service)
    {
        if ($this->option('live')) {
            $this->info('Starting Live Football Data Sync...');
            $service->syncMatches();
            $this->info('Live sync complete!');
            return;
        }

        $this->info('Starting Football Data Sync...');
        
        $this->info('Syncing Leagues...');
        $service->syncLeagues();

        $this->info('Syncing Fixtures for today...');
        $service->syncMatches();

        $this->info('Sync complete!');
    }
}
