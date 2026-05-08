<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Session;
use App\Repositories\ProductRepository;
use App\Services\ExternalProductSyncService;

final class AdminController
{
    public function dashboard(): void
    {
        $orders = $_SESSION['orders'] ?? [];
        view('admin/dashboard', [
            'title' => 'Admin Dashboard',
            'products' => (new ProductRepository())->paginate([], 1, 50),
            'orders' => $orders,
            'revenue' => array_sum(array_map(fn ($o) => $o['totals']['total'] ?? 0, $orders)),
        ]);
    }

    public function syncProducts(): void
    {
        $count = (new ExternalProductSyncService())->sync();
        Session::flash('success', "Sincronización completada: {$count} productos procesados.");
        redirect('/admin');
    }
}
