<article class="product-card">
  <a href="/products/<?= e($product['id']) ?>" class="product-media">
    <img loading="lazy" src="<?= e($product['images'][0] ?? 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80') ?>" alt="<?= e($product['name']) ?>">
  </a>
  <div class="product-body">
    <span><?= e($product['brand']) ?> · <?= e($product['category']) ?></span>
    <h3><a href="/products/<?= e($product['id']) ?>"><?= e($product['name']) ?></a></h3>
    <p><?= e(strlen($product['description']) > 96 ? substr($product['description'], 0, 96) . '...' : $product['description']) ?></p>
    <div class="price-row">
      <strong><?= money($product['offer_price'] ?: $product['price']) ?></strong>
      <?php if ($product['offer_price']): ?><del><?= money($product['price']) ?></del><?php endif; ?>
      <small>★ <?= e($product['rating']) ?></small>
    </div>
    <form action="/cart/add" method="post">
      <?= csrf_field() ?>
      <input type="hidden" name="product_id" value="<?= e($product['id']) ?>">
      <button class="btn primary full">Agregar</button>
    </form>
  </div>
</article>
