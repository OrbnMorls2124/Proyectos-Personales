<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Session;
use App\Repositories\ProductRepository;

final class CartService
{
    public function all(): array
    {
        $items = [];
        foreach (Session::get('cart', []) as $productId => $qty) {
            $product = (new ProductRepository())->find((int) $productId);
            if ($product) {
                $product['quantity'] = (int) $qty;
                $product['line_total'] = $this->unitPrice($product) * $product['quantity'];
                $items[] = $product;
            }
        }
        return $items;
    }

    public function add(int $productId, int $quantity = 1): void
    {
        $cart = Session::get('cart', []);
        $cart[$productId] = min(99, ($cart[$productId] ?? 0) + max(1, $quantity));
        Session::put('cart', $cart);
    }

    public function update(int $productId, int $quantity): void
    {
        $cart = Session::get('cart', []);
        if ($quantity <= 0) {
            unset($cart[$productId]);
        } else {
            $cart[$productId] = min(99, $quantity);
        }
        Session::put('cart', $cart);
    }

    public function totals(?string $coupon = null): array
    {
        $subtotal = array_sum(array_column($this->all(), 'line_total'));
        $discount = $coupon === 'NOVA15' ? round($subtotal * 0.15, 2) : 0.0;
        $taxable = max(0, $subtotal - $discount);
        $tax = round($taxable * (float) config('tax_rate'), 2);
        $shipping = $taxable >= (float) config('free_shipping_from') || $taxable === 0.0 ? 0.0 : 14.95;
        return compact('subtotal', 'discount', 'tax', 'shipping') + ['total' => round($taxable + $tax + $shipping, 2)];
    }

    private function unitPrice(array $product): float
    {
        return (float) ($product['offer_price'] ?: $product['price']);
    }
}
