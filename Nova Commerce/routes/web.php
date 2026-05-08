<?php

use App\Controllers\AccountController;
use App\Controllers\AdminController;
use App\Controllers\AuthController;
use App\Controllers\CartController;
use App\Controllers\CheckoutController;
use App\Controllers\HomeController;
use App\Controllers\ProductController;
use App\Middleware\AdminMiddleware;
use App\Middleware\AuthMiddleware;
use App\Middleware\CsrfMiddleware;
use App\Middleware\RateLimitMiddleware;

$router->get('/', [HomeController::class, 'index'], [RateLimitMiddleware::class]);
$router->get('/products', [ProductController::class, 'index'], [RateLimitMiddleware::class]);
$router->get('/products/{id}', [ProductController::class, 'show'], [RateLimitMiddleware::class]);

$router->get('/login', [AuthController::class, 'loginForm']);
$router->post('/login', [AuthController::class, 'login'], [CsrfMiddleware::class, RateLimitMiddleware::class]);
$router->get('/auth/google', [AuthController::class, 'googleRedirect'], [RateLimitMiddleware::class]);
$router->get('/auth/google/callback', [AuthController::class, 'googleCallback'], [RateLimitMiddleware::class]);
$router->get('/register', [AuthController::class, 'registerForm']);
$router->post('/register', [AuthController::class, 'register'], [CsrfMiddleware::class, RateLimitMiddleware::class]);
$router->get('/forgot-password', [AuthController::class, 'forgot']);
$router->post('/forgot-password', [AuthController::class, 'sendReset'], [CsrfMiddleware::class]);
$router->post('/logout', [AuthController::class, 'logout'], [CsrfMiddleware::class]);

$router->get('/cart', [CartController::class, 'index']);
$router->post('/cart/add', [CartController::class, 'add'], [CsrfMiddleware::class]);
$router->post('/cart/update', [CartController::class, 'update'], [CsrfMiddleware::class]);
$router->post('/cart/coupon', [CartController::class, 'coupon'], [CsrfMiddleware::class]);

$router->get('/checkout', [CheckoutController::class, 'index'], [AuthMiddleware::class]);
$router->post('/checkout', [CheckoutController::class, 'store'], [CsrfMiddleware::class, AuthMiddleware::class]);

$router->get('/account', [AccountController::class, 'index'], [AuthMiddleware::class]);
$router->get('/admin', [AdminController::class, 'dashboard'], [AuthMiddleware::class, AdminMiddleware::class]);
$router->post('/admin/sync-products', [AdminController::class, 'syncProducts'], [CsrfMiddleware::class, AuthMiddleware::class, AdminMiddleware::class]);
