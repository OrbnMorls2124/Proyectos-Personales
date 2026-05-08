<?php

declare(strict_types=1);

return [
    'google' => [
        'client_id' => env_value('GOOGLE_CLIENT_ID', ''),
        'client_secret' => env_value('GOOGLE_CLIENT_SECRET', ''),
        'redirect_uri' => env_value('GOOGLE_REDIRECT_URI', rtrim((string) env_value('APP_URL', 'http://127.0.0.1:8000'), '/') . '/auth/google/callback'),
        'authorization_endpoint' => 'https://accounts.google.com/o/oauth2/v2/auth',
        'token_endpoint' => 'https://oauth2.googleapis.com/token',
        'userinfo_endpoint' => 'https://openidconnect.googleapis.com/v1/userinfo',
        'scopes' => 'openid email profile',
    ],
];
