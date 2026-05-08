<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Core\Session;

final class RateLimitMiddleware
{
    public function handle(): void
    {
        $bucket = 'rate_' . ($_SERVER['REMOTE_ADDR'] ?? 'local');
        $hits = Session::get($bucket, []);
        $hits = array_filter($hits, fn (int $time): bool => $time > time() - 60);
        if (count($hits) > 80) {
            http_response_code(429);
            exit('Demasiadas solicitudes. Intenta nuevamente en un minuto.');
        }
        $hits[] = time();
        Session::put($bucket, $hits);
    }
}
