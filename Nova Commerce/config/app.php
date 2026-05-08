<?php

declare(strict_types=1);

return [
    'name' => env_value('APP_NAME', 'Nova Commerce'),
    'url' => env_value('APP_URL', 'http://127.0.0.1:8000'),
    'env' => env_value('APP_ENV', 'local'),
    'tax_rate' => (float) env_value('TAX_RATE', 0.15),
    'free_shipping_from' => (float) env_value('FREE_SHIPPING_FROM', 250),
    'cache_ttl' => (int) env_value('CACHE_TTL', 1800),
    'session_secure' => filter_var(env_value('SESSION_SECURE', false), FILTER_VALIDATE_BOOL),
];
