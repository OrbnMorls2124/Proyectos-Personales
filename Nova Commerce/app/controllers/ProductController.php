<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\ProductRepository;
use App\Services\RecommendationService;

final class ProductController
{
    public function index(): void
    {
        $repo = new ProductRepository();
        view('products/index', [
            'title' => 'Catálogo',
            'products' => $repo->paginate($_GET, max(1, (int) ($_GET['page'] ?? 1))),
            'categories' => $repo->categories(),
            'brands' => $repo->brands(),
            'filters' => $_GET,
        ]);
    }

    public function show(string $id): void
    {
        $product = (new ProductRepository())->find((int) $id);
        if (!$product) {
            http_response_code(404);
            view('errors/404', ['title' => 'Producto no encontrado']);
            return;
        }

        $_SESSION['recently_viewed'][(int) $id] = time();
        view('products/show', [
            'title' => $product['name'],
            'product' => $product,
            'related' => (new RecommendationService())->related($product),
        ]);
    }
}
