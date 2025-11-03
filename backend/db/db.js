// db/db.js
// Este archivo centraliza toda la conexión y funciones genéricas a MySQL.
// Es usado por los controladores (modules) y modelos.

// Importamos mysql2 para manejar la conexión
const mysql = require('mysql2/promise');

// Importamos la configuración desde config.js (en la raíz del backend)
const config = require('../config');

// Configuración de conexión a la base de datos
// Tomamos los valores desde config.mysql
const dbConfig = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database, // Asegúrate de usar el nombre correcto de tu DB
};

// Función para obtener una conexión activa
async function connection() {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
}

// --- LISTAR ---
// Devuelve todos los registros de una tabla
async function list(table) {
  const conn = await connection();
  const [rows] = await conn.query(`SELECT * FROM ${table}`);
  await conn.end();
  return rows;
}

// --- OBTENER ---
// Devuelve un registro según su id
async function get(table, id) {
  const conn = await connection();
  const [rows] = await conn.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
  await conn.end();
  return rows[0];
}

// --- INSERTAR/AGREGAR ---
// Inserta o actualiza un registro usando "ON DUPLICATE KEY UPDATE"
async function insert(table, data) {
  const conn = await connection();
  const [result] = await conn.query(`INSERT INTO ${table} SET ?`, [data]);
  await conn.end();
  return result;
}

// --- ACTUALIZAR (solo update explícito) ---
// Se usa cuando se quiere hacer un UPDATE sin intentar insertar primero
async function update(table, id, data) {
  const conn = await connection();
  const [result] = await conn.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, id]);
  await conn.end();
  return result;
}

// --- ELIMINAR ---
// Elimina un registro según su ID
async function remove(table, id) {
  const conn = await connection();
  const [result] = await conn.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
  await conn.end();
  return result;
}

// --- QUERY MANUAL ---
// Permite ejecutar SQL personalizado cuando se necesita algo más complejo
async function queryRaw(sql, params = []) {
  const conn = await connection();
  const [rows] = await conn.query(sql, params);
  await conn.end();
  return rows;
}

// Exportamos las funciones para que las use toda la app
module.exports = {
  list,
  get,
  insert,
  update,
  remove,
  queryRaw,
};
