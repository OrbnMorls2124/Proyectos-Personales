<section class="auth-shell">
  <form class="panel auth-card" action="/login" method="post">
    <?= csrf_field() ?>
    <h1>Ingresar</h1>
    <input name="email" type="email" required placeholder="Email">
    <input name="password" type="password" required placeholder="Contraseña">
    <button class="btn primary full">Entrar</button>
    <div class="auth-divider"><span>o</span></div>
    <a class="btn google full" href="/auth/google"><span>G</span> Continuar con Google</a>
    <p><a href="/forgot-password">Recuperar contraseña</a> · <a href="/register">Crear cuenta</a></p>
    <small>Admin demo: admin@example.com / password</small>
  </form>
</section>
