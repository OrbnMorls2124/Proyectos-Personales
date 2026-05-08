<?php

declare(strict_types=1);

require __DIR__ . '/app/bootstrap.php';

$count = (new App\Services\ExternalProductSyncService())->sync();
echo "Sincronizados {$count} productos desde APIs externas.\n";
