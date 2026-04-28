const jwt = require('jsonwebtoken');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    // En dev permitimos arrancar; en prod exige una clave fuerte.
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET es requerido y debe tener al menos 32 caracteres.');
    }
    return 'dev-only-insecure-secret-change-me-please-32chars';
  }
  return secret;
}

function requireAuth(req, res, next) {
  // Dejar pasar endpoints de autenticación
  if (req.path.startsWith('/auth')) return next();

  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ message: 'No autenticado' });

  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.auth = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Sesión inválida' });
  }
}

module.exports = { requireAuth, getJwtSecret };

