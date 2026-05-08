<section class="checkout-grid">
  <form class="panel checkout-form" action="/checkout" method="post" data-payment-form>
    <?= csrf_field() ?>
    <h1>Checkout seguro</h1>
    <div class="stepper"><span>Dirección</span><span>Envío</span><span>Pago</span><span>Confirmación</span></div>
    <div class="form-grid">
      <input name="name" required placeholder="Nombre completo">
      <input name="email" type="email" required placeholder="Email">
      <input name="phone" required placeholder="Teléfono">
      <input name="city" required placeholder="Ciudad">
      <input name="address" required class="wide" placeholder="Dirección de envío">
      <select name="shipping_method"><option>Express 24/48h</option><option>Estándar</option><option>Retiro en tienda</option></select>
      <select name="payment_method" data-payment-method>
        <option value="credit_card">Tarjeta de crédito</option>
        <option value="debit_card">Tarjeta de débito</option>
        <option value="paypal">PayPal simulado</option>
        <option value="bank_transfer">Transferencia bancaria</option>
        <option value="cod">Pago contra entrega</option>
        <option value="apple_pay">Apple Pay simulado</option>
        <option value="google_pay">Google Pay simulado</option>
      </select>
      <input name="card_number" data-card-number placeholder="4111 1111 1111 1111">
      <input name="card_expiry" placeholder="MM/YY">
      <input name="card_cvv" placeholder="CVV">
    </div>
    <div class="credit-card-preview"><span data-card-brand>NOVA CARD</span><strong data-card-mask>•••• •••• •••• ••••</strong><small>Pago simulado, sin cargos reales</small></div>
    <button class="btn primary full">Confirmar orden</button>
  </form>
  <aside class="panel summary">
    <h2>Tu pedido</h2>
    <?php foreach ($items as $item): ?><p><?= e($item['quantity']) ?> × <?= e($item['name']) ?></p><?php endforeach; ?>
    <?php partial('partials/totals', compact('totals')); ?>
  </aside>
</section>
