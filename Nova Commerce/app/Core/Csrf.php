<?php

declare(strict_types=1);

namespace App\Core;

final class Csrf
{
    public static function token(): string
    {
        if (!Session::get('_csrf')) {
            Session::put('_csrf', bin2hex(random_bytes(32)));
        }
        return (string) Session::get('_csrf');
    }

    public static function validate(?string $token): bool
    {
        return is_string($token) && hash_equals((string) Session::get('_csrf'), $token);
    }
}
