<section class="admin-grid">
  <aside class="admin-nav"><h1>Admin</h1><a>Dashboard</a><a>Productos</a><a>Órdenes</a><a>Usuarios</a><a>Cupones</a><a>Banners</a></aside>
  <div>
    <div class="kpi-row">
      <div class="kpi"><span>Ingresos</span><strong><?= money($revenue) ?></strong></div>
      <div class="kpi"><span>Productos</span><strong><?= count($products) ?></strong></div>
      <div class="kpi"><span>Pedidos</span><strong><?= count($orders) ?></strong></div>
      <div class="kpi"><span>Conversión</span><strong>4.8%</strong></div>
    </div>
    <div class="panel">
      <canvas id="salesChart" height="90"></canvas>
    </div>
    <div class="panel">
      <form action="/admin/sync-products" method="post"><?= csrf_field() ?><button class="btn primary">Sincronizar APIs reales</button></form>
      <table id="productsTable">
        <thead><tr><th>Producto</th><th>Marca</th><th>Categoría</th><th>Precio</th><th>Stock</th></tr></thead>
        <tbody><?php foreach ($products as $p): ?><tr><td><?= e($p['name']) ?></td><td><?= e($p['brand']) ?></td><td><?= e($p['category']) ?></td><td><?= money($p['price']) ?></td><td><?= e($p['stock']) ?></td></tr><?php endforeach; ?></tbody>
      </table>
    </div>
  </div>
</section>
