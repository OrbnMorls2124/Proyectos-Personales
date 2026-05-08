<?php use App\Core\Auth; use App\Core\Session; ?>
<!doctype html>
<html lang="es" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Nova Commerce, ecommerce premium de tecnología con pagos simulados, recomendaciones y envíos inteligentes.">
  <meta name="robots" content="index,follow">
  <meta property="og:title" content="<?= e($title ?? config('name')) ?>">
  <meta property="og:type" content="website">
  <title><?= e($title ?? config('name')) ?> | <?= e(config('name')) ?></title>
  <link rel="preconnect" href="https://images.unsplash.com">
  <link rel="stylesheet" href="https://cdn.datatables.net/2.1.8/css/dataTables.dataTables.min.css">
  <link rel="stylesheet" href="<?= e(vite_asset('public/assets/css/app.css')) ?>">
  <script defer src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script defer src="https://cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>
  <script defer src="<?= e(vite_asset('public/assets/js/app.js')) ?>"></script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="/">Nova<span>Commerce</span></a>
    <form class="search" action="/products" method="get">
      <input name="q" data-predictive-search placeholder="Buscar celulares, laptops, consolas..." autocomplete="off" value="<?= e($_GET['q'] ?? '') ?>">
      <div class="suggestions" data-suggestions></div>
    </form>
    <nav class="nav">
      <button class="icon-btn" type="button" data-theme-toggle aria-label="Cambiar tema">◐</button>
      <a href="/products">Catálogo</a>
      <a href="/cart">Carrito</a>
      <?php if (Auth::check()): ?>
        <a href="<?= Auth::isAdmin() ? '/admin' : '/account' ?>">Panel</a>
        <form action="/logout" method="post"><?= csrf_field() ?><button>Salir</button></form>
      <?php else: ?>
        <a href="/login">Ingresar</a>
      <?php endif; ?>
    </nav>
  </header>

  <?php if ($message = Session::flash('success')): ?><div class="toast success" data-toast><?= e($message) ?></div><?php endif; ?>
  <?php if ($message = Session::flash('error')): ?><div class="toast error" data-toast><?= e($message) ?></div><?php endif; ?>

  <main><?= $content ?></main>

  <aside class="support-chat" data-chat>
    <button data-chat-toggle>Soporte IA</button>
    <div class="chat-panel">
      <strong>Asistente Nova</strong>
      <p>Te ayudo a comparar productos, cupones y métodos de entrega.</p>
      <input placeholder="Escribe tu duda...">
    </div>
  </aside>

  <footer class="footer">
    <p>&copy; <?= date('Y') ?> Nova Commerce. Pagos simulados, arquitectura MVC y APIs reales.</p>
    <a href="/api/products">API REST</a>
  </footer>
</body>
</html>
