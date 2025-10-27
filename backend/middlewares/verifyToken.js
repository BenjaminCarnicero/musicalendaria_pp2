// backend/middleware/verifyToken.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = "supersecreto123"; // o usá process.env.JWT_SECRET

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = user; // ahora tenés acceso a req.user.id y req.user.rol
    next();
  });
};

module.exports = verifyToken;