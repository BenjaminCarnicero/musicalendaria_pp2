// token.js — Maneja la generación y validación de tokens JWT
// Se usa para proteger rutas y verificar identidad del usuario.

const jwt = require('jsonwebtoken');
const config = require('../../config');
const error = require('../../utils/customError');

const secret = config.jwt.secret;

// --- Generar un nuevo token ---
function assignToken(data) {
    return jwt.sign(data, secret);
}

// --- Verificar un token existente ---
function verifyToken(token) {
    return jwt.verify(token, secret);
}

// --- Middleware personalizado para validar tokens ---
const checkToken = {
    confirmToken: function (req, id) {
        const decoded = decodeHeader(req);
        if (decoded.id !== id) {
            throw error('No tienes privilegios para hacer esto.', 401);
        }
    }
};

// --- Extrae y valida el token del header Authorization ---
function getToken(authorization) {
    if (!authorization) {
        throw error('No viene token', 401);
    }

    if (authorization.indexOf('Bearer') === -1) {
        throw error('Formato inválido', 401);
    }

    return authorization.replace('Bearer ', '');
}

// --- Decodifica el token presente en la cabecera ---
function decodeHeader(req) {
    const authorization = req.headers.authorization || '';
    const token = getToken(authorization);
    const decoded = verifyToken(token);
    req.user = decoded;
    return decoded;
}

module.exports = {
    assignToken,
    checkToken
};
