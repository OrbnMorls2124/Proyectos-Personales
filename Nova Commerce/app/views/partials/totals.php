<dl class="totals">
  <div><dt>Subtotal</dt><dd><?= money($totals['subtotal']) ?></dd></div>
  <div><dt>Descuento</dt><dd>-<?= money($totals['discount']) ?></dd></div>
  <div><dt>Impuestos</dt><dd><?= money($totals['tax']) ?></dd></div>
  <div><dt>Envío</dt><dd><?= money($totals['shipping']) ?></dd></div>
  <div class="grand"><dt>Total</dt><dd><?= money($totals['total']) ?></dd></div>
</dl>
