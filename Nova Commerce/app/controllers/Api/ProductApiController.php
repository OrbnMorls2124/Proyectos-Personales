<?php

declare(strict_types=1);

namespace App\Controllers\Api;

use App\Core\Response;
use App\Repositories\ProductRepository;
use App\Services\RecommendationService;

final class ProductApiController
{
    public function index(): void
    {
        Response::json(['data' => (new ProductRepository())->paginate($_GET, 1, 20)]);
    }

    public function predict(): void
    {
        Response::json(['suggestions' => (new RecommendationService())->predict((string) ($_GET['q'] ?? ''))]);
    }
}
