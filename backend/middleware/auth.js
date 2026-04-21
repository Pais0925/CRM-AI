const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hermes_dev_secret_change_in_prod';

/**
 * authenticate — validates the Bearer JWT on every protected request.
 * Attaches decoded { id, email, role } to req.user.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid or expired.' });
  }
}

/**
 * authorize — factory that accepts allowed roles.
 * Usage: router.get('/protected', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), handler)
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required roles: ${roles.join(', ')}. Your role: ${req.user.role}.`
      });
    }
    next();
  };
}

module.exports = { authenticate, authorize, JWT_SECRET };
