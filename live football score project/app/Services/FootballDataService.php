<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\League;
use App\Models\Team;
use App\Models\Fixture;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class FootballDataService
{
    protected $baseUrl = 'https://api.football-data.org/v4';
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.football_data.key');
    }

    protected function request()
    {
        return Http::withHeaders([
            'X-Auth-Token' => $this->apiKey,
        ]);
    }

    /**
     * Fetch competitions (leagues)
     */
    public function syncLeagues()
    {
        $response = $this->request()->get("{$this->baseUrl}/competitions");

        if ($response->successful()) {
            $competitions = $response->json()['competitions'];
            foreach ($competitions as $item) {
                // We only sync the ones we care about or all if desired
                // Football-data IDs: PL=2021, PD=2014, SA=2019, BL1=2002, FL1=2015, CL=2001
                League::updateOrCreate(
                    ['id' => $item['id']],
                    [
                        'name' => $item['name'],
                        'type' => 'League',
                        'logo' => $item['emblem'],
                        'country' => $item['area']['name'],
                    ]
                );
            }
        } else {
            Log::error('Football-Data Error (Leagues): ' . $response->body());
        }
    }

    /**
     * Fetch matches for a specific date range or today
     */
    public function syncMatches($date = null)
    {
        // Tier One (Free) Competition IDs
        $tierOneIds = [2000, 2001, 2018, 2021, 2014, 2019, 2002, 2015, 2017, 2003, 2024, 2013];
        $dateFrom = $date ?: now()->subDays(1)->format('Y-m-d');
        $dateTo = $date ?: now()->addDays(1)->format('Y-m-d');

        foreach ($tierOneIds as $compId) {
            $response = $this->request()->get("{$this->baseUrl}/competitions/{$compId}/matches", [
                'dateFrom' => $dateFrom,
                'dateTo' => $dateTo
            ]);

            if ($response->successful()) {
                $matches = $response->json()['matches'] ?? [];
                foreach ($matches as $item) {
                    // Ensure Teams exist
                    foreach (['homeTeam', 'awayTeam'] as $side) {
                        Team::updateOrCreate(
                            ['id' => $item[$side]['id']],
                            [
                                'name' => $item[$side]['name'],
                                'logo' => $item[$side]['crest'] ?? null,
                            ]
                        );
                    }

                    // Update Fixture
                    Fixture::updateOrCreate(
                        ['id' => $item['id']],
                        [
                            'league_id' => $item['competition']['id'],
                            'home_team_id' => $item['homeTeam']['id'],
                            'away_team_id' => $item['awayTeam']['id'],
                            'date' => Carbon::parse($item['utcDate']),
                            'status_long' => $item['status'],
                            'status_short' => $this->mapStatus($item['status']),
                            'elapsed' => $this->calculateElapsed($item),
                            'home_score' => $item['score']['fullTime']['home'] ?? 0,
                            'away_score' => $item['score']['fullTime']['away'] ?? 0,
                            'round' => $item['matchday'] ?? 0,
                        ]
                    );
                }
            } else {
                Log::warning("Football-Data warning: Could not sync competition {$compId}. Status: " . $response->status());
            }
            
            // Avoid hitting rate limits too fast (Free tier: 10 calls/minute)
            usleep(200000); 
        }
    }

    protected function mapStatus($status)
    {
        $map = [
            'IN_PLAY' => 'LIVE',
            'PAUSED' => 'HT',
            'FINISHED' => 'FT',
            'SCHEDULED' => 'NS',
            'TIMED' => 'NS',
            'POSTPONED' => 'PST',
            'CANCELLED' => 'CAN',
            'SUSPENDED' => 'SUSP'
        ];

        return $map[$status] ?? $status;
    }

    protected function calculateElapsed($match)
    {
        if ($match['status'] !== 'IN_PLAY' && $match['status'] !== 'PAUSED') {
            return 0;
        }

        // If it's paused (HT), cap at 45
        if ($match['status'] === 'PAUSED') {
            return 45;
        }

        $kickoff = Carbon::parse($match['utcDate']);
        $now = now();
        $diffInMinutes = (int) $kickoff->diffInMinutes($now);

        // If more than 45 mins have passed from kickoff, we're in the second half.
        // Subtract ~15 minutes for the halftime break to get the real game minute.
        if ($diffInMinutes > 50) {
            $diffInMinutes = max(46, $diffInMinutes - 15);
        }

        return $diffInMinutes;
    }
}
