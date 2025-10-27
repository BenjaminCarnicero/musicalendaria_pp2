const models = require('../models/models'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Clave secreta para JWT (podes moverla a .env)
const SECRET_KEY = "supersecreto123";


// Registrar usuario
const registerUser = (req, res) => {
    const { nombre, email, password, rol } = req.body;
    console.log("📥 Llegó la petición de registro:", req.body);

    if (!rol) {
        return res.status(400).json({ message: 'El rol es obligatorio' });
    }
    
    // Usuarios prohibidos
    const forbiddenNames = ['Eminem', 'Dua Lipa', 'Catriel', 'Paco Amoroso'];
    if (forbiddenNames.includes(nombreArtistico.trim())) {
    return res.status(403).json({ error: 'Este artista no está permitido en la plataforma.' });
    }

    // Verificar que el usuario no exista primero
        models.findUserByEmail(email, (err, results) => {
         if (err) {
             console.error('❌ Error al consultar usuario existente:', err);
             return res.status(500).json({ message: 'Error al registrar el usuario' });
         }
////revisar
    models.registerUser({ nombre, email, password: hashedPassword, rol }, (err, result) => {
    if (err) {
        console.error('❌ Error al insertar usuario en DB:', err);
        return res.status(500).json({ message: 'Error al registrar el usuario' });
    }

    const userId = result.insertId; // ← este es el ID del nuevo usuario

    console.log('✅ Usuario insertado correctamente en DB:', result);

    // Si el rol es artista, podés crear el perfil vacío
    if (rol === 'artista') {
        const nuevoArtista = { user_id: userId };
        models.createArtistProfile(nuevoArtista); // ← esta función la vas a crear en models.js
    }

    return res.status(201).json({ message: 'Usuario registrado correctamente', userId });
    });


        if (results.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hashear la contraseña antes de guardar
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('❌ Error al hashear la contraseña:', err);
                return res.status(500).json({ message: 'Error al registrar el usuario' });
            }

            // Guardar usuario usando models.js
            models.registerUser({ nombre, email, password: hashedPassword }, (err, result) => {
                if (err) {
                    console.error('❌ Error al insertar usuario en DB:', err);
                    return res.status(500).json({ message: 'Error al registrar el usuario' });
                }

                console.log('✅ Usuario insertado correctamente en DB:', result);
                return res.status(201).json({ message: 'Usuario registrado correctamente' });
            });
        });
    });
};

// Login de usuario
const loginUser = (req, res) => {
    const { email, password } = req.body;

    models.findUserByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en el servidor' });

        if (results.length === 0) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error en el servidor' });

            if (!isMatch) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            // Crear token
            const token = jwt.sign(
                { id: user.id, email: user.email, rol: user.rol || null },
                SECRET_KEY,
                { expiresIn: '2h' }
            );

            res.json({ message: 'Login exitoso', token });
        });
    });
};

module.exports = { registerUser, loginUser };



//controlador artista

exports.getArtistProfile = (req, res) => {
  if (req.user.rol !== 'artista') {
    return res.status(403).json({ error: 'Acceso solo para artistas' });
  }

  const userId = req.user.id;
  models.getArtistByUserId(userId, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener perfil' });
    res.json(result[0]);
  });
};


exports.updateArtistProfile = (req, res) => {
  if (req.user.rol !== 'artista') {
    return res.status(403).json({ error: 'Acceso solo para artistas' });
  }

  const userId = req.user.id;
  const data = req.body;
  models.updateArtistProfile(userId, data, (err) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar perfil' });
    res.json({ message: 'Perfil actualizado correctamente' });
  });
};



exports.createArtistProfile = (req, res) => {
  if (req.user.rol !== 'artista') {
    return res.status(403).json({ error: 'Acceso solo para artistas' });
  }

  const userId = req.user.id;
  const data = { ...req.body, user_id: userId };
  models.createArtistProfile(data, (err) => {
    if (err) return res.status(500).json({ error: 'Error al crear perfil' });
    res.json({ message: 'Perfil creado correctamente' });
  });
};



// Controlador eventos

exports.createEvento = (req, res) => {
  if (req.user.rol !== 'artista') {
    return res.status(403).json({ error: 'Acceso solo para artistas' });
  }

  const userId = req.user.id;
  const eventoData = { ...req.body, user_id: userId };
  models.createEvento(eventoData, (err) => {
    if (err) return res.status(500).json({ error: 'Error al crear evento' });
    res.json({ message: 'Evento creado correctamente' });
  });
};

exports.getMisEventos = (req, res) => {
  if (req.user.rol !== 'artista') {
    return res.status(403).json({ error: 'Acceso solo para artistas' });
  }

  const userId = req.user.id;
  models.getEventosByUserId(userId, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener eventos' });
    res.json(result);
  });
};

exports.updateEvento = (req, res) => {
  if (req.user.rol !== 'artista') {
    return res.status(403).json({ error: 'Acceso solo para artistas' });
  }

  const eventoId = req.params.id;
  const data = req.body;
  models.updateEvento(eventoId, data, (err) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar evento' });
    res.json({ message: 'Evento actualizado correctamente' });
  });
};

exports.deleteEvento = (req, res) => {
  if (req.user.rol !== 'artista') {
    return res.status(403).json({ error: 'Acceso solo para artistas' });
  }

  const eventoId = req.params.id;
  models.deleteEvento(eventoId, (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar evento' });
    res.json({ message: 'Evento eliminado correctamente' });
  });
};