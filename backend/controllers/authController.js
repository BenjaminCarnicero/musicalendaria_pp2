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
