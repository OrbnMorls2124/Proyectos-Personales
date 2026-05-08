<section class="hero">
  <div>
    <p class="eyebrow">Ecommerce tecnológico 2026</p>
    <h1>Compra tecnología premium con una experiencia rápida, clara y segura.</h1>
    <p>Catálogo sincronizado desde APIs reales, checkout visual, recomendaciones automáticas y panel administrativo listo para crecer.</p>
    <div class="actions">
      <a class="btn primary" href="/products">Explorar catálogo</a>
      <a class="btn ghost" href="/register">Crear cuenta</a>
    </div>
  </div>
  <div class="hero-device">
    <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80" alt="Laptop premium">
  </div>
</section>

<section class="category-strip">
  <?php foreach ($categories as $category): ?>
    <a href="/products?category=<?= urlencode($category) ?>"><?= e($category) ?></a>
  <?php endforeach; ?>
</section>

<section class="section-head">
  <div>
    <p class="eyebrow">Selección destacada</p>
    <h2>Productos con mejor conversión</h2>
  </div>
  <a href="/products">Ver todos</a>
</section>
<div class="product-grid">
  <?php foreach ($featured as $product): ?>
    <?php partial('components/product-card', compact('product')); ?>
  <?php endforeach; ?>
</div>
