<section class="auth-shell">
  <form class="panel auth-card" action="/register" method="post">
    <?= csrf_field() ?>
    <h1>Crear cuenta</h1>
    <input name="name" required placeholder="Nombre">
    <input name="email" type="email" required placeholder="Email">
    <input name="password" type="password" minlength="8" required placeholder="Contraseña">
    <button class="btn primary full">Registrarme</button>
    <div class="auth-divider"><span>o</span></div>
    <a class="btn google full" href="/auth/google"><span>G</span> Continuar con Google</a>
  </form>
</section>
