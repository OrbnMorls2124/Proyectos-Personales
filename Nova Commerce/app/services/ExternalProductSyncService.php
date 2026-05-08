<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Cache;
use App\Repositories\ProductRepository;

final class ExternalProductSyncService
{
    public function sync(): int
    {
        $products = array_merge($this->dummyJson(), $this->fakeStore());
        $repo = new ProductRepository();
        foreach ($products as $product) {
            $repo->upsertFromApi($product);
        }
        return count($products);
    }

    public function dummyJson(): array
    {
        return Cache::remember('dummyjson-products', (int) config('cache_ttl'), function (): array {
            $json = @file_get_contents('https://dummyjson.com/products/category/smartphones');
            $data = $json ? json_decode($json, true) : [];
            return array_map(fn ($p) => $this->mapDummy($p), $data['products'] ?? []);
        });
    }

    public function fakeStore(): array
    {
        return Cache::remember('fakestore-electronics', (int) config('cache_ttl'), function (): array {
            $json = @file_get_contents('https://fakestoreapi.com/products/category/electronics');
            $data = $json ? json_decode($json, true) : [];
            return array_map(fn ($p) => $this->mapFakeStore($p), $data);
        });
    }

    private function mapDummy(array $p): array
    {
        return [
            'external_id' => 'dummy-' . $p['id'],
            'source' => 'DummyJSON',
            'name' => $p['title'],
            'slug' => strtolower(preg_replace('/[^a-z0-9]+/i', '-', $p['title'])),
            'description' => $p['description'] ?? '',
            'price' => (float) $p['price'],
            'offer_price' => round((float) $p['price'] * (1 - (($p['discountPercentage'] ?? 0) / 100)), 2),
            'stock' => (int) ($p['stock'] ?? 25),
            'sku' => 'DJ-' . $p['id'],
            'images' => json_encode($p['images'] ?? [$p['thumbnail']]),
            'rating' => (float) ($p['rating'] ?? 4.3),
            'specs' => json_encode(['Garantía' => '12 meses', 'Origen' => 'API DummyJSON']),
            'brand' => $p['brand'] ?? 'Tech',
            'category' => 'Celulares',
            'subcategory' => 'Smartphones',
            'variants' => json_encode(['color' => ['Negro', 'Azul', 'Titanio'], 'almacenamiento' => ['128GB', '256GB']]),
            'featured' => 1,
        ];
    }

    private function mapFakeStore(array $p): array
    {
        return [
            'external_id' => 'fake-' . $p['id'],
            'source' => 'Fake Store API',
            'name' => $p['title'],
            'slug' => strtolower(preg_replace('/[^a-z0-9]+/i', '-', $p['title'])),
            'description' => $p['description'] ?? '',
            'price' => (float) $p['price'],
            'offer_price' => null,
            'stock' => 30,
            'sku' => 'FS-' . $p['id'],
            'images' => json_encode([$p['image']]),
            'rating' => (float) ($p['rating']['rate'] ?? 4.0),
            'specs' => json_encode(['Origen' => 'Fake Store API', 'Condición' => 'Nuevo']),
            'brand' => 'Nova Select',
            'category' => 'Componentes PC',
            'subcategory' => 'Electrónica',
            'variants' => json_encode(['color' => ['Negro'], 'tamaño' => ['Único']]),
            'featured' => 0,
        ];
    }
}
