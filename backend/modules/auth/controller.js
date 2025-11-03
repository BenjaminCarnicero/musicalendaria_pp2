// controller.js — Lógica de negocio para autenticación y registro de usuarios (artistas).
// Se encarga de validar credenciales, encriptar contraseñas y generar tokens JWT.

const bcrypt = require('bcrypt');
const token = require('./token');
const db = require('../../db/db');
const artistController = require('../artist/controller'); // Para crear artista junto al registro
const TABLE = 'usuarios';

// --- LOGIN: verifica usuario y contraseña ---
async function login(username, password) {
    // Busca en la tabla auth por usuario o email
    const sql = `SELECT * FROM ${TABLE} WHERE usuario = ? OR email = ? LIMIT 1`;
    const values = [username, username];

    const rows = await db.queryRaw(sql, values);
    const user = rows[0];

    if (!user) {
        throw new Error('Usuario o email no registrado');
    }

    // Compara la contraseña ingresada con la almacenada (hash bcrypt)
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        throw new Error('Contraseña incorrecta');
    }

    // Si las credenciales son correctas, genera un token JWT
    const newToken = token.assignToken({ id: user.id, usuario: user.usuario });

    // Devuelve el token y el ID del usuario
    return {
        token: newToken,
        id: user.id,
        rol: user.rol

    };
}

// --- REGISTRO: crea un nuevo artista + credenciales ---
async function register(data) {
  // 1. Validar si el usuario o email ya existen
  const existing = await db.queryRaw(
    'SELECT id FROM usuarios WHERE usuario = ? OR email = ?',
    [data.usuario, data.email]
  );

  if (existing.length > 0) {
    throw new Error('El usuario o email ya está registrado');
  }

  // 2. Insertar usuario en tabla usuarios
  const authData = {
    usuario: data.usuario,
    nombre: data.nombre,
    email: data.email,
    password: await bcrypt.hash(data.password.toString(), 5),
    rol: data.rol
  };

  const authInsert = await db.insert('usuarios', authData);
  const userId = authInsert.insertId;

  // 3. Si el rol es artista, crear perfil en tabla artistas
  if (data.rol === 'artist') {
    await artistController.addArtist({
      user_id: userId,
      name: data.nombre,
      email: data.email
    });
  }

  // 4. Devolver respuesta
  return {
    message: "Usuario registrado correctamente.",
    insertId: userId
  };
}

// Exporta las funciones
module.exports = {
    login,
    register
};
