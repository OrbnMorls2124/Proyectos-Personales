<?php

use Livewire\Volt\Component;
use App\Models\Fixture;
use App\Models\League;

new class extends Component
{
    public function with()
    {
        return [
            'fixtures' => Fixture::with(['homeTeam', 'awayTeam', 'league'])
                ->where('date', '>=', now()->subDays(3)->startOfDay())
                ->orderBy('date', 'desc')
                ->get()
                ->groupBy('league_id'),
        ];
    }
};
?>

<div class="py-12 bg-gray-900 min-h-screen text-white" wire:poll.10s>
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <header class="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
            <h1 class="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                <span class="text-lime-400">⚡</span> Futura<span class="text-lime-400">Score</span>
            </h1>
            <div class="flex items-center space-x-4">
                <button class="px-4 py-2 bg-gray-800 rounded-full text-sm font-medium hover:bg-gray-700 transition">
                    Explorar Ligas
                </button>
                <div class="w-8 h-8 rounded-full bg-lime-400"></div>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Partidos en Vivo Section -->
            <div class="lg:col-span-2 space-y-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold">Partidos de Hoy</h2>
                    <span class="px-3 py-1 bg-lime-400 text-black text-xs font-bold rounded-full animate-pulse">LIVE</span>
                </div>

                @forelse($fixtures as $leagueId => $leagueFixtures)
                    <div class="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden backdrop-blur-sm">
                        <div class="p-4 bg-gray-800 flex items-center gap-3">
                            @if($leagueFixtures->first()->league->logo)
                                <img src="{{ $leagueFixtures->first()->league->logo }}" alt="" class="w-6 h-6 rounded">
                            @endif
                            <h3 class="font-semibold text-gray-200">{{ $leagueFixtures->first()->league->name }}</h3>
                        </div>
                        <div class="divide-y divide-gray-700">
                            @foreach($leagueFixtures as $fixture)
                                @php
                                    $isLive = in_array($fixture->status_short, ['LIVE', '1H', '2H', 'HT', 'ET', 'BT', 'P', 'SUSP', 'INT']);
                                    $liveMinute = $fixture->elapsed;
                                    if ($isLive && !in_array($fixture->status_short, ['HT', 'FT'])) {
                                        $liveMinute = max($fixture->elapsed, $fixture->date->diffInMinutes(now()));
                                    }
                                @endphp
                                <div class="p-5 hover:bg-gray-700/30 transition flex items-center justify-between cursor-pointer"
                                     x-data="{ 
                                        isLive: {{ $isLive ? 'true' : 'false' }},
                                        serverElapsed: {{ (int) $liveMinute }},
                                        startTime: Date.now(),
                                        currentElapsed: {{ (int) $liveMinute }},
                                        init() {
                                            if (this.isLive && !['HT', 'FT', 'SUSP', 'INT'].includes('{{ $fixture->status_short }}')) {
                                                setInterval(() => {
                                                    let diff = Math.floor((Date.now() - this.startTime) / 1000);
                                                    this.currentElapsed = this.serverElapsed + Math.floor(diff / 60);
                                                }, 1000);
                                            }
                                        }
                                     }"
                                     wire:key="fixture-{{ $fixture->id }}"
                                >
                                    <div class="flex flex-col items-center justify-center w-16 text-center">
                                        <!-- Scheduled Time -->
                                        <span class="text-[11px] text-gray-500 font-medium" 
                                              x-data="{ 
                                                formatTime(utcDate) {
                                                    try {
                                                        return new Date(utcDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                                                    } catch(e) {
                                                        return '{{ $fixture->date->format('H:i') }}';
                                                    }
                                                }
                                              }"
                                              x-text="formatTime('{{ $fixture->date->toIso8601String() }}')">
                                            {{ $fixture->date->format('H:i') }}
                                        </span>
                                        
                                        <!-- Status or Live Minute -->
                                        @if($isLive)
                                            <span class="text-xs text-lime-400 font-bold mt-0.5" x-text="currentElapsed + '\''">
                                                {{ $fixture->elapsed ?? 0 }}'
                                            </span>
                                        @else
                                            <span class="text-[10px] text-gray-400 uppercase font-bold mt-0.5">{{ $fixture->status_short }}</span>
                                        @endif
                                    </div>

                                    <div class="flex-1 px-4">
                                        <div class="flex items-center justify-between mb-2">
                                            <div class="flex items-center gap-3">
                                                <img src="{{ $fixture->homeTeam->logo }}" alt="" class="w-8 h-8">
                                                <span class="font-medium text-lg">{{ $fixture->homeTeam->name }}</span>
                                            </div>
                                            <span class="text-2xl font-bold {{ $fixture->status_short === 'LIVE' ? 'text-lime-400' : 'text-white' }}">
                                                {{ $fixture->home_score }}
                                            </span>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center gap-3">
                                                <img src="{{ $fixture->awayTeam->logo }}" alt="" class="w-8 h-8">
                                                <span class="font-medium text-lg">{{ $fixture->awayTeam->name }}</span>
                                            </div>
                                            <span class="text-2xl font-bold {{ $fixture->status_short === 'LIVE' ? 'text-lime-400' : 'text-white' }}">
                                                {{ $fixture->away_score }}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div class="pl-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-gray-500">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @empty
                    <div class="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700 border-dashed">
                        <div class="mb-4 text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm6 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75z" />
                            </svg>
                        </div>
                        <p class="text-gray-400">No hay partidos cargados aún.</p>
                        <p class="text-sm text-gray-500 mt-2">Usa el comando de sincronización para obtener datos reales.</p>
                    </div>
                @endforelse
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <div class="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 backdrop-blur-sm">
                    <h2 class="text-lg font-bold mb-4">Ligas Destacadas</h2>
                    <ul class="space-y-4">
                        <li class="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg transition cursor-pointer">
                            <div class="w-2 h-2 rounded-full bg-lime-400"></div>
                            <span>Champions League</span>
                        </li>
                        <li class="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg transition cursor-pointer">
                            <div class="w-2 h-2 rounded-full bg-transparent border border-gray-600"></div>
                            <span>Premier League</span>
                        </li>
                        <li class="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg transition cursor-pointer">
                            <div class="w-2 h-2 rounded-full bg-transparent border border-gray-600"></div>
                            <span>La Liga</span>
                        </li>
                    </ul>
                </div>

                <div class="bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl p-6 text-black shadow-xl shadow-lime-500/10">
                    <h3 class="text-xl font-extrabold mb-1 uppercase italic tracking-tighter">Futura Premium</h3>
                    <p class="text-sm font-semibold mb-4 opacity-80">Stats avanzadas, predicciones y alertas en tiempo real.</p>
                    <button class="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition shadow-lg">MEJORAR AHORA</button>
                </div>
            </div>
        </div>
    </div>
</div>