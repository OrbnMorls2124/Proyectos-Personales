<section class="catalog-layout">
  <aside class="filters">
    <h2>Filtros</h2>
    <form>
      <input name="q" placeholder="Buscar" value="<?= e($filters['q'] ?? '') ?>">
      <select name="category"><option value="">Categoría</option><?php foreach ($categories as $c): ?><option <?= ($filters['category'] ?? '') === $c ? 'selected' : '' ?>><?= e($c) ?></option><?php endforeach; ?></select>
      <select name="brand"><option value="">Marca</option><?php foreach ($brands as $b): ?><option <?= ($filters['brand'] ?? '') === $b ? 'selected' : '' ?>><?= e($b) ?></option><?php endforeach; ?></select>
      <select name="sort">
        <option value="recent">Recientes</option>
        <option value="popular" <?= ($filters['sort'] ?? '') === 'popular' ? 'selected' : '' ?>>Popularidad</option>
        <option value="price_asc" <?= ($filters['sort'] ?? '') === 'price_asc' ? 'selected' : '' ?>>Precio menor</option>
        <option value="price_desc" <?= ($filters['sort'] ?? '') === 'price_desc' ? 'selected' : '' ?>>Precio mayor</option>
      </select>
      <button class="btn primary full">Aplicar</button>
    </form>
  </aside>
  <section>
    <div class="section-head compact"><h1>Catálogo tecnológico</h1><p><?= count($products) ?> resultados</p></div>
    <div class="product-grid">
      <?php foreach ($products as $product): ?>
        <?php partial('components/product-card', compact('product')); ?>
      <?php endforeach; ?>
    </div>
  </section>
</section>
