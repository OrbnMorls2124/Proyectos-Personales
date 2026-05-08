<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Core\Auth;

final class AdminMiddleware
{
    public function handle(): void
    {
        if (!Auth::isAdmin()) {
            http_response_code(403);
            exit('Acceso administrativo requerido.');
        }
    }
}
