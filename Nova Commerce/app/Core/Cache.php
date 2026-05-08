<?php

declare(strict_types=1);

namespace App\Core;

final class Cache
{
    public static function remember(string $key, int $ttl, callable $callback): mixed
    {
        $file = base_path('storage/cache/' . sha1($key) . '.json');
        if (is_file($file)) {
            $payload = json_decode((string) file_get_contents($file), true);
            if (($payload['expires_at'] ?? 0) > time()) {
                return $payload['data'];
            }
        }

        $data = $callback();
        file_put_contents($file, json_encode(['expires_at' => time() + $ttl, 'data' => $data], JSON_PRETTY_PRINT));
        return $data;
    }
}
