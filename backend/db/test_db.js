const db = require('./db');

(async () => {
  try {
    const usuarios = await db.list('usuarios');
    console.log('Conexión exitosa ✅');
    console.log('Usuarios:', usuarios);
  } catch (error) {
    console.error('Error al conectar ❌', error);
  }
})();
