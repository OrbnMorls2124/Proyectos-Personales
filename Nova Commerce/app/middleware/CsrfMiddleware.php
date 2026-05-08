<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Core\Csrf;

final class CsrfMiddleware
{
    public function handle(): void
    {
        if (!Csrf::validate($_POST['_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null)) {
            http_response_code(419);
            exit('Token CSRF inválido.');
        }
    }
}
