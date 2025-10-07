const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// Registro
router.post('/register', authController.registerUser);

// Login
router.post('/login', authController.loginUser);

module.exports = router;

