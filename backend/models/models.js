const db = require('./db.js');

// Buscar usuario por email
exports.findUserByEmail = (email, callback) => {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('❌ Error al buscar usuario por email:', err);
        }
        callback(err, results);
    });
};

// Registrar usuario
exports.registerUser = (userData, callback) => {
    const { nombre, email, password, rol } = userData;
    const query = `
        INSERT INTO usuarios (nombre, email, password, rol)
        VALUES (?, ?, ?, ?)
    `;
    db.query(query, [nombre, email, password, rol], (err, result) => {
        if (err) {
            console.error('❌ Error al insertar en usuarios:', err);
        } else {
            console.log('✅ Usuario insertado correctamente en usuarios:', result);
        }
        callback(err, result);
    });
};
