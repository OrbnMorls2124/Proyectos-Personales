<section class="auth-shell">
  <form class="panel auth-card" action="/forgot-password" method="post">
    <?= csrf_field() ?>
    <h1>Recuperar contraseña</h1>
    <input name="email" type="email" required placeholder="Email">
    <button class="btn primary full">Enviar enlace simulado</button>
  </form>
</section>
