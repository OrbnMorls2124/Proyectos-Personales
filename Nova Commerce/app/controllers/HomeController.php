<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\ProductRepository;

final class HomeController
{
    public function index(): void
    {
        $repo = new ProductRepository();
        view('home/index', [
            'title' => 'Tecnología premium para comprar mejor',
            'featured' => $repo->featured(8),
            'categories' => $repo->categories(),
        ]);
    }
}
