<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Session;
use App\Services\CartService;

final class CartController
{
    public function index(): void
    {
        $cart = new CartService();
        view('cart/index', ['title' => 'Carrito', 'items' => $cart->all(), 'totals' => $cart->totals(Session::get('coupon'))]);
    }

    public function add(): void
    {
        (new CartService())->add((int) $_POST['product_id'], (int) ($_POST['quantity'] ?? 1));
        Session::flash('success', 'Producto agregado al carrito.');
        redirect($_SERVER['HTTP_REFERER'] ?? '/cart');
    }

    public function update(): void
    {
        (new CartService())->update((int) $_POST['product_id'], (int) $_POST['quantity']);
        redirect('/cart');
    }

    public function coupon(): void
    {
        Session::put('coupon', strtoupper(trim((string) ($_POST['coupon'] ?? ''))));
        Session::flash('success', 'Cupón aplicado.');
        redirect('/cart');
    }
}
