<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fixture_id');
            $table->integer('time_elapsed');
            $table->integer('time_extra')->nullable();
            $table->unsignedBigInteger('team_id');
            $table->string('player_name')->nullable();
            $table->string('type');
            $table->string('detail')->nullable();
            $table->timestamps();

            $table->foreign('fixture_id')->references('id')->on('fixtures')->onDelete('cascade');
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
