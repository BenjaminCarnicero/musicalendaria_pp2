const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
//solo le quite el log nomas
// Registro
router.post('/register', authController.registerUser);
// Login
//router.post('/login', authController.loginUser);

// Perfil protegido
//router.get('/perfil', authController.perfil);
module.exports = router;

