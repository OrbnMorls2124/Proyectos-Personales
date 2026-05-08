<?php

declare(strict_types=1);

namespace App\Core;

final class Router
{
    private array $routes = [];

    public function get(string $path, array $action, array $middleware = []): void
    {
        $this->add('GET', $path, $action, $middleware);
    }

    public function post(string $path, array $action, array $middleware = []): void
    {
        $this->add('POST', $path, $action, $middleware);
    }

    public function delete(string $path, array $action, array $middleware = []): void
    {
        $this->add('DELETE', $path, $action, $middleware);
    }

    private function add(string $method, string $path, array $action, array $middleware): void
    {
        $pattern = preg_replace('#\{([a-zA-Z_][a-zA-Z0-9_]*)\}#', '(?P<$1>[^/]+)', $path);
        $this->routes[$method][] = [
            'pattern' => '#^' . $pattern . '$#',
            'action' => $action,
            'middleware' => $middleware,
        ];
    }

    public function dispatch(string $method, string $path): void
    {
        $method = $_POST['_method'] ?? $method;
        foreach ($this->routes[strtoupper($method)] ?? [] as $route) {
            if (!preg_match($route['pattern'], $path, $matches)) {
                continue;
            }

            foreach ($route['middleware'] as $middleware) {
                (new $middleware())->handle();
            }

            [$controller, $methodName] = $route['action'];
            $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
            (new $controller())->{$methodName}(...array_values($params));
            return;
        }

        http_response_code(404);
        view('errors/404', ['title' => 'Página no encontrada']);
    }
}
