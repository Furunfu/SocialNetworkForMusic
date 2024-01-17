const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');

const userController = require('../controllers/userController');

// Recupera name, surname e email
router.get('/me', isAuthenticated, userController.getMe);

// Endpoint per aggiornare le informazioni dell'utente
router.put('/updateData', isAuthenticated, userController.updateData);

//Endpoint per eliminare l'account dell'utente
router.delete('/delete', isAuthenticated, userController.deleteUser);

/*
  Like / Unlike
*/
router.post('/like/playlist/:id', isAuthenticated, userController.likesHandler('playlist', 'like'));

router.delete('/like/playlist/:id', isAuthenticated, userController.likesHandler('playlist', 'unlike'));

module.exports = router;