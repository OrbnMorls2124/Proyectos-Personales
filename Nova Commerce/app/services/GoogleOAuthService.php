<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Cache;
use App\Core\Session;
use RuntimeException;

final class GoogleOAuthService
{
    private array $config;

    public function __construct()
    {
        $services = require base_path('config/services.php');
        $this->config = $services['google'];
    }

    public function configured(): bool
    {
        return $this->config['client_id'] !== '' && $this->config['client_secret'] !== '';
    }

    public function redirectUrl(): string
    {
        if (!$this->configured()) {
            throw new RuntimeException('Google OAuth no está configurado.');
        }

        $state = bin2hex(random_bytes(24));
        Session::put('google_oauth_state', $state);

        return $this->config['authorization_endpoint'] . '?' . http_build_query([
            'client_id' => $this->config['client_id'],
            'redirect_uri' => $this->config['redirect_uri'],
            'response_type' => 'code',
            'scope' => $this->config['scopes'],
            'state' => $state,
            'access_type' => 'online',
            'prompt' => 'select_account',
        ]);
    }

    public function userFromCallback(array $query): array
    {
        if (($query['error'] ?? null) !== null) {
            throw new RuntimeException('Google rechazó el inicio de sesión: ' . $query['error']);
        }

        if (!hash_equals((string) Session::get('google_oauth_state'), (string) ($query['state'] ?? ''))) {
            throw new RuntimeException('Estado OAuth inválido. Intenta iniciar sesión nuevamente.');
        }

        $code = (string) ($query['code'] ?? '');
        if ($code === '') {
            throw new RuntimeException('Google no devolvió código de autorización.');
        }

        $token = $this->token($code);
        $user = $this->userinfo((string) ($token['access_token'] ?? ''));

        if (($user['email_verified'] ?? false) !== true && ($user['verified_email'] ?? false) !== true) {
            throw new RuntimeException('Tu cuenta de Google debe tener el correo verificado.');
        }

        return [
            'google_id' => (string) ($user['sub'] ?? ''),
            'name' => (string) ($user['name'] ?? $user['email']),
            'email' => strtolower((string) $user['email']),
            'avatar' => (string) ($user['picture'] ?? ''),
        ];
    }

    private function token(string $code): array
    {
        $response = $this->post($this->config['token_endpoint'], [
            'code' => $code,
            'client_id' => $this->config['client_id'],
            'client_secret' => $this->config['client_secret'],
            'redirect_uri' => $this->config['redirect_uri'],
            'grant_type' => 'authorization_code',
        ]);

        if (empty($response['access_token'])) {
            throw new RuntimeException('No se pudo obtener el token de Google.');
        }

        return $response;
    }

    private function userinfo(string $accessToken): array
    {
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'header' => "Authorization: Bearer {$accessToken}\r\nAccept: application/json\r\n",
                'timeout' => 12,
            ],
        ]);

        $json = @file_get_contents($this->config['userinfo_endpoint'], false, $context);
        $data = $json ? json_decode($json, true) : [];
        if (empty($data['email']) || empty($data['sub'])) {
            throw new RuntimeException('Google no devolvió un perfil válido.');
        }

        return $data;
    }

    private function post(string $url, array $payload): array
    {
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/x-www-form-urlencoded\r\nAccept: application/json\r\n",
                'content' => http_build_query($payload),
                'timeout' => 12,
            ],
        ]);

        $json = @file_get_contents($url, false, $context);
        return $json ? json_decode($json, true) ?: [] : [];
    }
}
