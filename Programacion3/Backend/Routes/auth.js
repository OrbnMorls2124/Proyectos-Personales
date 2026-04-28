const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { getJwtSecret } = require('../middleware/auth');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

function isBcryptHash(value) {
  return typeof value === 'string' && value.startsWith('$2');
}

router.post('/login', loginLimiter, (req, res) => {
  const { usuario, contrasena } = req.body || {};
  if (!usuario || !contrasena) {
    return res.status(400).json({ message: 'usuario y contrasena son requeridos' });
  }

  req.getConnection((err, conn) => {
    if (err) return res.status(500).json({ message: 'Error de conexión' });

    conn.query('SELECT userid, usuario, clave, estado, idtpusuario, idemp FROM usuario WHERE usuario = ? LIMIT 1', [usuario], async (qErr, rows) => {
      if (qErr) return res.status(500).json({ message: 'Error de consulta' });
      if (!rows || rows.length === 0) return res.status(401).json({ message: 'Credenciales inválidas' });

      const user = rows[0];
      if (user.estado && String(user.estado).toLowerCase() !== 'activo') {
        return res.status(403).json({ message: 'Usuario inactivo' });
      }

      const stored = user.clave;
      let ok = false;
      try {
        ok = isBcryptHash(stored) ? await bcrypt.compare(contrasena, stored) : (String(contrasena) === String(stored));
      } catch {
        ok = false;
      }
      if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

      // Si estaba en texto plano, migrar a bcrypt al primer login correcto.
      if (!isBcryptHash(stored)) {
        try {
          const hash = await bcrypt.hash(contrasena, 12);
          conn.query('UPDATE usuario SET clave = ? WHERE userid = ?', [hash, user.userid], () => {});
        } catch {}
      }

      const token = jwt.sign(
        { userid: user.userid, usuario: user.usuario, idtpusuario: user.idtpusuario, idemp: user.idemp },
        getJwtSecret(),
        { expiresIn: '2h' }
      );

      const isProd = process.env.NODE_ENV === 'production';
      res.cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
        maxAge: 2 * 60 * 60 * 1000,
      });

      return res.json({ ok: true, user: { userid: user.userid, usuario: user.usuario, idtpusuario: user.idtpusuario, idemp: user.idemp } });
    });
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ message: 'No autenticado' });
  try {
    const payload = jwt.verify(token, getJwtSecret());
    return res.json({ ok: true, user: payload });
  } catch {
    return res.status(401).json({ message: 'Sesión inválida' });
  }
});

module.exports = router;

