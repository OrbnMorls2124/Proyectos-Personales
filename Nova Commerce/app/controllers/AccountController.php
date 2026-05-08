<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;

final class AccountController
{
    public function index(): void
    {
        view('account/index', [
            'title' => 'Mi cuenta',
            'user' => Auth::user(),
            'orders' => $_SESSION['orders'] ?? [],
            'wishlist' => $_SESSION['wishlist'] ?? [],
        ]);
    }
}
