<section class="product-detail">
  <div class="gallery">
    <?php foreach (array_slice($product['images'], 0, 4) as $image): ?>
      <img src="<?= e($image) ?>" alt="<?= e($product['name']) ?>">
    <?php endforeach; ?>
  </div>
  <div class="detail-panel">
    <p class="eyebrow"><?= e($product['brand']) ?> · SKU <?= e($product['sku']) ?></p>
    <h1><?= e($product['name']) ?></h1>
    <p><?= e($product['description']) ?></p>
    <div class="rating">★★★★★ <span><?= e($product['rating']) ?> / 5 · reseñas verificadas</span></div>
    <div class="detail-price"><?= money($product['offer_price'] ?: $product['price']) ?> <?php if ($product['offer_price']): ?><del><?= money($product['price']) ?></del><?php endif; ?></div>
    <form action="/cart/add" method="post" class="buy-box">
      <?= csrf_field() ?>
      <input type="hidden" name="product_id" value="<?= e($product['id']) ?>">
      <input type="number" name="quantity" min="1" max="<?= e($product['stock']) ?>" value="1">
      <button class="btn primary">Agregar al carrito</button>
      <button type="button" class="btn ghost" data-wishlist>Wishlist</button>
    </form>
    <div class="specs">
      <?php foreach ($product['specs'] as $key => $value): ?><p><strong><?= e($key) ?>:</strong> <?= e($value) ?></p><?php endforeach; ?>
    </div>
  </div>
</section>
<section class="section-head"><h2>Relacionados inteligentes</h2></section>
<div class="product-grid">
  <?php foreach ($related as $product): ?>
    <?php partial('components/product-card', compact('product')); ?>
  <?php endforeach; ?>
</div>
