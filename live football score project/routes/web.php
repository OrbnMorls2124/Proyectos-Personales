<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome'); // Or just use a direct Livewire component
})->name('home');

Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

// Redirect / to /dashboard or just render it
Route::view('/', 'welcome');
