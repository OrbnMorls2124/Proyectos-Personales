<?php

declare(strict_types=1);

namespace App\Core;

final class View
{
    public static function render(string $template, array $data = [], string $layout = 'layouts/app'): void
    {
        extract($data, EXTR_SKIP);
        ob_start();
        require base_path('app/views/' . $template . '.php');
        $content = ob_get_clean();
        require base_path('app/views/' . $layout . '.php');
    }

    public static function partial(string $template, array $data = []): void
    {
        extract($data, EXTR_SKIP);
        require base_path('app/views/' . $template . '.php');
    }
}
