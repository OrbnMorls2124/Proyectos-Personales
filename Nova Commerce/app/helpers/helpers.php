<?php

declare(strict_types=1);

use App\Core\Csrf;
use App\Core\View;

function base_path(string $path = ''): string
{
    return dirname(__DIR__, 2) . ($path ? DIRECTORY_SEPARATOR . ltrim($path, DIRECTORY_SEPARATOR) : '');
}

function config(string $key, mixed $default = null): mixed
{
    static $config = null;
    $config ??= require base_path('config/app.php');
    return $config[$key] ?? $default;
}

function env_value(string $key, mixed $default = null): mixed
{
    static $env = null;
    if ($env === null) {
        $env = [];
        $file = base_path('.env');
        if (is_file($file)) {
            foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
                if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) {
                    continue;
                }
                [$name, $value] = array_map('trim', explode('=', $line, 2));
                $env[$name] = trim($value, "\"'");
            }
        }
    }
    return $_ENV[$key] ?? $_SERVER[$key] ?? $env[$key] ?? $default;
}

function view(string $template, array $data = [], string $layout = 'layouts/app'): void
{
    View::render($template, $data, $layout);
}

function partial(string $template, array $data = []): void
{
    View::partial($template, $data);
}

function redirect(string $path): never
{
    header('Location: ' . $path, true, 302);
    exit;
}

function e(mixed $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function money(float|int|string $value): string
{
    return '$' . number_format((float) $value, 2);
}

function csrf_field(): string
{
    return '<input type="hidden" name="_token" value="' . e(Csrf::token()) . '">';
}

function asset(string $path): string
{
    return '/assets/' . ltrim($path, '/');
}

function vite_asset(string $entry): string
{
    $manifest = base_path('public/build/.vite/manifest.json');
    if (is_file($manifest)) {
        $assets = json_decode((string) file_get_contents($manifest), true) ?: [];
        if (isset($assets[$entry]['file'])) {
            return '/build/' . $assets[$entry]['file'];
        }
    }

    return '/' . ltrim($entry, '/');
}
