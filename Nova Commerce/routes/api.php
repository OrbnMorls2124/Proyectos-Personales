<?php

use App\Controllers\Api\ProductApiController;
use App\Middleware\RateLimitMiddleware;

$router->get('/api/products', [ProductApiController::class, 'index'], [RateLimitMiddleware::class]);
$router->get('/api/search/predict', [ProductApiController::class, 'predict'], [RateLimitMiddleware::class]);
