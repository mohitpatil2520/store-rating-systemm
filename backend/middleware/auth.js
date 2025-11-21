const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET = 'replace_me' } = process.env;

function authenticateJWT(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ message: 'No token provided' });
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid auth header' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, role, email }
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
}

function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (!Array.isArray(allowedRoles)) allowedRoles = [allowedRoles];
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

module.exports = { authenticateJWT, requireRole };
