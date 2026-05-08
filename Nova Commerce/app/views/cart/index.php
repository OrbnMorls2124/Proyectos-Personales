<section class="checkout-grid">
  <div class="panel">
    <h1>Carrito</h1>
    <?php foreach ($items as $item): ?>
      <div class="cart-line">
        <img src="<?= e($item['images'][0]) ?>" alt="<?= e($item['name']) ?>">
        <div><strong><?= e($item['name']) ?></strong><p><?= money($item['line_total']) ?></p></div>
        <form action="/cart/update" method="post">
          <?= csrf_field() ?>
          <input type="hidden" name="product_id" value="<?= e($item['id']) ?>">
          <input type="number" name="quantity" min="0" value="<?= e($item['quantity']) ?>">
          <button>Actualizar</button>
        </form>
      </div>
    <?php endforeach; ?>
    <?php if (!$items): ?><p>Tu carrito está vacío.</p><?php endif; ?>
  </div>
  <aside class="panel summary">
    <h2>Resumen</h2>
    <form action="/cart/coupon" method="post" class="coupon"><?= csrf_field() ?><input name="coupon" placeholder="Cupón NOVA15"><button>Aplicar</button></form>
    <?php partial('partials/totals', compact('totals')); ?>
    <a class="btn primary full" href="/checkout">Continuar al checkout</a>
  </aside>
</section>
