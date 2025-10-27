const db = require('./db.js');

// Buscar usuario por email
exports.findUserByEmail = (email, callback) => {
    const query = 'SELECT id, nombre, email, password, rol FROM usuarios WHERE email = ?';
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


// Perfil del artista.
exports.createArtistProfile = (artistData, callback) => {
  const query = 'INSERT INTO artists SET ?';
  db.query(query, artistData, callback);
};

exports.getArtistByUserId = (userId, callback) => {
  const query = 'SELECT * FROM artists WHERE user_id = ?';
  db.query(query, [userId], callback);
};

exports.updateArtistProfile = (userId, data, callback) => {
  const query = 'UPDATE artists SET ? WHERE user_id = ?';
  db.query(query, [data, userId], callback);
};



// Eventos

exports.createEvento = (eventoData, callback) => {
  const query = 'INSERT INTO eventos SET ?';
  db.query(query, eventoData, callback);
};

exports.getEventosByUserId = (userId, callback) => {
  const query = 'SELECT * FROM eventos WHERE user_id = ?';
  db.query(query, [userId], callback);
};

exports.updateEvento = (eventoId, data, callback) => {
  const query = 'UPDATE eventos SET ? WHERE id = ?';
  db.query(query, [data, eventoId], callback);
};

exports.deleteEvento = (eventoId, callback) => {
  const query = 'DELETE FROM eventos WHERE id = ?';
  db.query(query, [eventoId], callback);
};