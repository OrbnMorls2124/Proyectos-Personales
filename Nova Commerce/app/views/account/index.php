<section class="account-grid">
  <aside class="panel"><h1><?= e($user['name'] ?? 'Cliente') ?></h1><p><?= e($user['email'] ?? '') ?></p><a>Perfil</a><a>Wishlist</a><a>Direcciones</a><a>Métodos simulados</a></aside>
  <div class="panel">
    <h2>Historial de pedidos</h2>
    <?php foreach ($orders as $order): ?>
      <div class="order-line"><strong><?= e($order['number']) ?></strong><span><?= e($order['status']) ?></span><span><?= money($order['totals']['total']) ?></span></div>
    <?php endforeach; ?>
    <?php if (!$orders): ?><p>Aún no tienes pedidos.</p><?php endif; ?>
  </div>
</section>
