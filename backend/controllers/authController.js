const models = require('../models/models'); 
const bcrypt = require('bcryptjs');

// Registrar usuario
const registerUser = (req, res) => {
    const { nombre, email, password } = req.body;
    console.log("📥 Llegó la petición de registro:", req.body);

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

module.exports = { registerUser };
