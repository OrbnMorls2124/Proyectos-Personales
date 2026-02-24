<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fixture extends Model
{
    use HasFactory;

    public $incrementing = false;

    protected $fillable = [
        'id',
        'league_id',
        'home_team_id',
        'away_team_id',
        'date',
        'status_long',
        'status_short',
        'elapsed',
        'home_score',
        'away_score',
        'round',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    public function league()
    {
        return $this->belongsTo(League::class);
    }

    public function homeTeam()
    {
        return $this->belongsTo(Team::class, 'home_team_id');
    }

    public function awayTeam()
    {
        return $this->belongsTo(Team::class, 'away_team_id');
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
