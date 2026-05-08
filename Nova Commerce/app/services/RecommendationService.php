<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\ProductRepository;

final class RecommendationService
{
    public function related(array $product, int $limit = 4): array
    {
        $products = (new ProductRepository())->paginate(['category' => $product['category'], 'sort' => 'popular'], 1, $limit + 1);
        return array_values(array_filter($products, fn ($item) => (int) $item['id'] !== (int) $product['id'])) ?: (new ProductRepository())->featured($limit);
    }

    public function predict(string $query): array
    {
        return array_slice(array_map(fn ($p) => $p['name'], (new ProductRepository())->paginate(['q' => $query], 1, 6)), 0, 6);
    }
}
