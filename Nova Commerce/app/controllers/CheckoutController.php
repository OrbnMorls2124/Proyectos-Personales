<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Session;
use App\Services\CartService;
use App\Services\PaymentSimulationService;

final class CheckoutController
{
    public function index(): void
    {
        $cart = new CartService();
        view('checkout/index', ['title' => 'Checkout', 'items' => $cart->all(), 'totals' => $cart->totals(Session::get('coupon'))]);
    }

    public function store(): void
    {
        $payment = (new PaymentSimulationService())->validate($_POST);
        if (!$payment['ok']) {
            Session::flash('error', $payment['message']);
            redirect('/checkout');
        }

        $order = [
            'number' => 'NV-' . date('Ymd') . '-' . random_int(1000, 9999),
            'status' => 'pagado',
            'payment' => $payment,
            'totals' => (new CartService())->totals(Session::get('coupon')),
            'items' => (new CartService())->all(),
            'created_at' => date('c'),
        ];
        $_SESSION['orders'][] = $order;
        Session::forget('cart');
        Session::flash('success', 'Orden creada. Pago simulado aprobado.');
        view('checkout/success', ['title' => 'Orden confirmada', 'order' => $order]);
    }
}
