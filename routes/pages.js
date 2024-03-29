const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const getUserInfo = require('../middlewares/getUserInfo');
const pagesController = require('../controllers/pagesController');

router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/login', pagesController.login);

router.get('/register', pagesController.register);

router.get('/logout', pagesController.logout);


// Following routes should be accessed only if user is authenticated


router.get('/home', isAuthenticated, getUserInfo, pagesController.home);

router.get('/search', isAuthenticated, getUserInfo, pagesController.search);

router.get('/profile', isAuthenticated, getUserInfo, pagesController.profile);

router.get('/playlist/:playlistId', isAuthenticated, getUserInfo, pagesController.playlist);

router.get('/playlistHome', isAuthenticated, getUserInfo, pagesController.playlistHome);

router.get('/users/:userId', isAuthenticated, getUserInfo, pagesController.user);

router.use((req, res, next) => {
    res.status(404).send('404: Page Not Found!');
});

module.exports = router;