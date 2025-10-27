const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// Registro
router.post('/register', authController.registerUser);

// Login
router.post('/login', authController.loginUser);

module.exports = router;

//artista
const verifyToken = require('../middleware/verifyToken');
const {
  getArtistProfile,
  updateArtistProfile,
  createArtistProfile
} = require('../controllers/artistController');

router.get('/profile', verifyToken, getArtistProfile);
router.put('/profile', verifyToken, updateArtistProfile);
router.post('/profile', verifyToken, createArtistProfile);

module.exports = router;


//Eventos
const verifyToken = require('../middleware/verifyToken');
const {
  createEvento,
  getMisEventos,
  updateEvento,
  deleteEvento
} = require('../controllers/eventController');

router.post('/', verifyToken, createEvento);
router.get('/', verifyToken, getMisEventos);
router.put('/:id', verifyToken, updateEvento);
router.delete('/:id', verifyToken, deleteEvento);

module.exports = router;