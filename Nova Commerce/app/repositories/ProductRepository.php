<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\Database;
use PDO;

final class ProductRepository
{
    public function paginate(array $filters = [], int $page = 1, int $perPage = 12): array
    {
        if (!Database::available()) {
            return $this->fallbackProducts($filters);
        }

        $pdo = Database::pdo();
        $where = ['status = "active"'];
        $params = [];

        if (!empty($filters['q'])) {
            $where[] = '(name LIKE :q OR description LIKE :q OR brand LIKE :q)';
            $params['q'] = '%' . $filters['q'] . '%';
        }
        if (!empty($filters['category'])) {
            $where[] = 'category = :category';
            $params['category'] = $filters['category'];
        }
        if (!empty($filters['brand'])) {
            $where[] = 'brand = :brand';
            $params['brand'] = $filters['brand'];
        }

        $order = match ($filters['sort'] ?? 'recent') {
            'price_asc' => 'price ASC',
            'price_desc' => 'price DESC',
            'popular' => 'rating DESC, sales_count DESC',
            default => 'created_at DESC'
        };

        $offset = max(0, ($page - 1) * $perPage);
        $sql = 'SELECT * FROM products WHERE ' . implode(' AND ', $where) . " ORDER BY {$order} LIMIT :limit OFFSET :offset";
        $stmt = $pdo->prepare($sql);
        foreach ($params as $key => $value) {
            $stmt->bindValue(':' . $key, $value);
        }
        $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return array_map([$this, 'normalize'], $stmt->fetchAll());
    }

    public function featured(int $limit = 8): array
    {
        if (!Database::available()) {
            return array_slice($this->fallbackProducts(), 0, $limit);
        }
        $stmt = Database::pdo()?->prepare('SELECT * FROM products WHERE featured = 1 AND status = "active" ORDER BY rating DESC LIMIT :limit');
        $stmt?->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt?->execute();
        return array_map([$this, 'normalize'], $stmt?->fetchAll() ?: []);
    }

    public function find(int $id): ?array
    {
        if (!Database::available()) {
            foreach ($this->fallbackProducts() as $product) {
                if ((int) $product['id'] === $id) {
                    return $product;
                }
            }
            return null;
        }
        $stmt = Database::pdo()?->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
        $stmt?->execute(['id' => $id]);
        $product = $stmt?->fetch();
        return $product ? $this->normalize($product) : null;
    }

    public function upsertFromApi(array $product): void
    {
        if (!Database::available()) {
            return;
        }

        $sql = 'INSERT INTO products (external_id, source, name, slug, description, price, offer_price, stock, sku, images, rating, specs, brand, category, subcategory, variants, featured, status, created_at, updated_at)
                VALUES (:external_id, :source, :name, :slug, :description, :price, :offer_price, :stock, :sku, :images, :rating, :specs, :brand, :category, :subcategory, :variants, :featured, "active", NOW(), NOW())
                ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), price=VALUES(price), offer_price=VALUES(offer_price), stock=VALUES(stock), images=VALUES(images), rating=VALUES(rating), specs=VALUES(specs), brand=VALUES(brand), category=VALUES(category), subcategory=VALUES(subcategory), variants=VALUES(variants), updated_at=NOW()';
        Database::pdo()?->prepare($sql)->execute($product);
    }

    public function categories(): array
    {
        return ['Celulares', 'Laptops', 'Smartwatches', 'Consolas', 'TVs', 'Componentes PC', 'Audio', 'Accesorios'];
    }

    public function brands(): array
    {
        return ['Apple', 'Samsung', 'Sony', 'Dell', 'Lenovo', 'Asus', 'LG', 'Logitech', 'Microsoft', 'Xiaomi'];
    }

    private function normalize(array $product): array
    {
        foreach (['images', 'specs', 'variants'] as $json) {
            $product[$json] = is_string($product[$json] ?? null) ? json_decode($product[$json], true) ?: [] : ($product[$json] ?? []);
        }
        return $product;
    }

    private function fallbackProducts(array $filters = []): array
    {
        $products = require base_path('database/seeders/fallback-products.php');
        if (!empty($filters['q'])) {
            $q = strtolower($filters['q']);
            $products = array_values(array_filter($products, fn ($p) => str_contains(strtolower($p['name'] . ' ' . $p['description'] . ' ' . $p['brand']), $q)));
        }
        if (!empty($filters['category'])) {
            $products = array_values(array_filter($products, fn ($p) => $p['category'] === $filters['category']));
        }
        return $products;
    }
}
