<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\League;
use App\Models\Team;
use App\Models\Fixture;
use App\Models\Event;
use Illuminate\Support\Facades\Log;

class FootballApiService
{
    protected $baseUrl = 'https://api-football-v1.p.rapidapi.com/v3';
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.football_api.key');
    }

    protected function request()
    {
        return Http::withHeaders([
            'x-rapidapi-host' => 'api-football-v1.p.rapidapi.com',
            'x-rapidapi-key' => $this->apiKey,
        ]);
    }

    public function fetchLeagues($ids = [])
    {
        $params = !empty($ids) ? ['id' => implode('-', $ids)] : [];
        $response = $this->request()->get("{$this->baseUrl}/leagues", $params);

        if ($response->successful()) {
            return $response->json()['response'];
        }

        Log::error('API-Football Error (Leagues): ' . $response->body());
        return [];
    }

    public function fetchFixtures($date = null, $leagueId = null, $live = false)
    {
        $params = [];
        if ($live) {
            $params['live'] = 'all';
        } else {
            if ($date) $params['date'] = $date;
            if ($leagueId) $params['league'] = $leagueId;
        }

        $response = $this->request()->get("{$this->baseUrl}/fixtures", $params);

        if ($response->successful()) {
            return $response->json()['response'];
        }

        Log::error('API-Football Error (Fixtures): ' . $response->body());
        return [];
    }

    public function syncLeagues($ids)
    {
        $leagues = $this->fetchLeagues($ids);

        foreach ($leagues as $item) {
            League::updateOrCreate(
                ['id' => $item['league']['id']],
                [
                    'name' => $item['league']['name'],
                    'type' => $item['league']['type'],
                    'logo' => $item['league']['logo'],
                    'country' => $item['country']['name'],
                ]
            );
        }
    }

    public function syncFixturesByDate($date)
    {
        $fixtures = $this->fetchFixtures($date);

        foreach ($fixtures as $item) {
            // First ensure teams exist
            foreach (['home', 'away'] as $side) {
                Team::updateOrCreate(
                    ['id' => $item['teams'][$side]['id']],
                    [
                        'name' => $item['teams'][$side]['name'],
                        'logo' => $item['teams'][$side]['logo'],
                    ]
                );
            }

            // Update Fixture
            Fixture::updateOrCreate(
                ['id' => $item['fixture']['id']],
                [
                    'league_id' => $item['league']['id'],
                    'home_team_id' => $item['teams']['home']['id'],
                    'away_team_id' => $item['teams']['away']['id'],
                    'date' => $item['fixture']['date'],
                    'status_long' => $item['fixture']['status']['long'],
                    'status_short' => $item['fixture']['status']['short'],
                    'elapsed' => $item['fixture']['status']['elapsed'],
                    'home_score' => $item['goals']['home'] ?? 0,
                    'away_score' => $item['goals']['away'] ?? 0,
                    'round' => $item['league']['round'],
                ]
            );
        }
    }

    public function syncLiveFixtures()
    {
        $fixtures = $this->fetchFixtures(null, null, true);

        foreach ($fixtures as $item) {
            // First ensure teams exist
            foreach (['home', 'away'] as $side) {
                Team::updateOrCreate(
                    ['id' => $item['teams'][$side]['id']],
                    [
                        'name' => $item['teams'][$side]['name'],
                        'logo' => $item['teams'][$side]['logo'],
                    ]
                );
            }

            // Update Fixture
            Fixture::updateOrCreate(
                ['id' => $item['fixture']['id']],
                [
                    'league_id' => $item['league']['id'],
                    'home_team_id' => $item['teams']['home']['id'],
                    'away_team_id' => $item['teams']['away']['id'],
                    'date' => $item['fixture']['date'],
                    'status_long' => $item['fixture']['status']['long'],
                    'status_short' => $item['fixture']['status']['short'],
                    'elapsed' => $item['fixture']['status']['elapsed'],
                    'home_score' => $item['goals']['home'] ?? 0,
                    'away_score' => $item['goals']['away'] ?? 0,
                    'round' => $item['league']['round'] ?? '',
                ]
            );
        }
    }
}
