<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\League;
use App\Models\Team;
use App\Models\Fixture;
use Carbon\Carbon;

class MockDataSeeder extends Seeder
{
    public function run(): void
    {
        // Sample League
        $premierLeague = League::updateOrCreate(
            ['id' => 39],
            [
                'name' => 'Premier League',
                'type' => 'League',
                'logo' => 'https://media.api-sports.io/football/leagues/39.png',
                'country' => 'England',
            ]
        );

        $laLiga = League::updateOrCreate(
            ['id' => 140],
            [
                'name' => 'La Liga',
                'type' => 'League',
                'logo' => 'https://media.api-sports.io/football/leagues/140.png',
                'country' => 'Spain',
            ]
        );

        $bundesliga = League::updateOrCreate(
            ['id' => 78],
            [
                'name' => 'Bundesliga',
                'type' => 'League',
                'logo' => 'https://media.api-sports.io/football/leagues/78.png',
                'country' => 'Germany',
            ]
        );

        // Sample Teams
        $teams = [
            ['id' => 33, 'name' => 'Manchester United', 'logo' => 'https://media.api-sports.io/football/teams/33.png'],
            ['id' => 42, 'name' => 'Arsenal', 'logo' => 'https://media.api-sports.io/football/teams/42.png'],
            ['id' => 541, 'name' => 'Real Madrid', 'logo' => 'https://media.api-sports.io/football/teams/541.png'],
            ['id' => 529, 'name' => 'Barcelona', 'logo' => 'https://media.api-sports.io/football/teams/529.png'],
        ];

        foreach ($teams as $team) {
            Team::updateOrCreate(['id' => $team['id']], ['name' => $team['name'], 'logo' => $team['logo']]);
        }

        // Real Match found via search: Manchester United 1 - 0 Everton
        $everton = Team::updateOrCreate(
            ['id' => 45],
            ['name' => 'Everton', 'logo' => 'https://media.api-sports.io/football/teams/45.png']
        );

        Fixture::updateOrCreate(
            ['id' => 1001],
            [
                'league_id' => 39,
                'home_team_id' => 33, // Man Utd
                'away_team_id' => 45, // Everton
                'date' => Carbon::now(),
                'status_long' => 'First Half',
                'status_short' => '1H',
                'elapsed' => 71,
                'home_score' => 1,
                'away_score' => 0,
                'round' => 'Regular Season - 25',
            ]
        );

        // Another realistic fixture for Bundesliga
        $bayern = Team::updateOrCreate(
            ['id' => 157],
            ['name' => 'Bayern Munich', 'logo' => 'https://media.api-sports.io/football/teams/157.png']
        );
        $dortmund = Team::updateOrCreate(
            ['id' => 165],
            ['name' => 'Borussia Dortmund', 'logo' => 'https://media.api-sports.io/football/teams/165.png']
        );

        Fixture::updateOrCreate(
            ['id' => 1003],
            [
                'league_id' => 78, // Bundesliga
                'home_team_id' => 157,
                'away_team_id' => 165,
                'date' => Carbon::now(),
                'status_long' => 'Live',
                'status_short' => 'LIVE',
                'elapsed' => 32,
                'home_score' => 1,
                'away_score' => 1,
                'round' => 'Matchday 23',
            ]
        );
    }
}
