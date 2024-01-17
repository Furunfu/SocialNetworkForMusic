const path = require('path');
const spotifyAuth = require('../services/spotifyAuth');
const spotifyHomeService = require('../services/spotifyHomeService');
const playlistService = require('../services/playlistService');
const userService = require('../services/userService');
const { ObjectId } = require('mongodb');
const { client } = require('../database/connection');

exports.login = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/html/login.html'));
};

exports.register = async (req, res) => {
    try {
        const genres = await spotifyAuth.getGenres();
        const artists = await spotifyAuth.getArtists();
        res.render('register', { genres, artists });
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore nel recuperare le informazioni da Spotify');
    }};

exports.logout = (req, res) => {
    res.cookie('auth_token', '', { expires: new Date(0) });
    res.redirect('/login');
};

exports.playlistHome = async (req, res) => {
    try {
        const userPlaylists = await playlistService.getPlaylistsByUserId(req.userId);
        res.render('playlistHome', { title: "Playlist Home", userPlaylists});
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore nel recuperare le informazioni da Spotify');
    }
};

exports.home = async (req, res) => {
    try {
        const tracks = await spotifyHomeService.getGlobalTopTracks();
        const artists = await spotifyHomeService.getGlobalTopArtists();
        const newReleases = await spotifyHomeService.getNewReleases();
        const userPlaylists = await playlistService.getPlaylistsByUserId(req.userId);
        res.render('home', { title: "Home", tracks, artists, newReleases, userPlaylists, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore nel recuperare le informazioni da Spotify');
    }
};

exports.search = async (req, res) => {
    try {
        const userPlaylists = await playlistService.getPlaylistsByUserId(req.userId);
        res.render('search', {userPlaylists, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Errore nel recuperare le informazioni');
    }
};

exports.profile = async (req, res) => {
    try {
        const userPlaylists = await playlistService.getPlaylistsByUserId(req.userId);
        const genres = await spotifyAuth.getGenres();
        const artists = await spotifyAuth.getArtists();
        const likedPlaylists = await userService.getLikedPlaylistsByUserId(req.userId);
        const isMe = true;
        res.render('profile', { title: "Profile", isMe, user: req.user, genres, artists, profilePlaylists: userPlaylists, likedPlaylists });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore del server' });
    }
};

exports.playlist = async (req, res) => {
    try {
        const playlistId = req.params.playlistId;

        const playlistDetails = await playlistService.getPlaylistById(playlistId);
        const playlistTracksDetails = await playlistService.getTracksDetailsByPlaylistId(playlistId);
        const userPlaylists = await playlistService.getPlaylistsByUserId(req.userId);
        const isLiked = req.user.likedPlaylists.map(id => id.toString()).includes(playlistId);

        if (!playlistDetails) {
            return res.status(404).send('Playlist not found');
        }

        const isOwner = req.userId === playlistDetails.createdBy.toString();
        res.render('playlist', { title: "Playlist", user: req.user, userPlaylists, playlistDetails, playlistTracksDetails, isOwner, isLiked});
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

exports.user = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Se l'ID non ha un formato valido, invia un errore
        if (!ObjectId.isValid(userId)) {
            return res.status(400).send("ID utente non valido");
        }

        // Trova l'utente nel database
        const profileUser = await client.db("pwm").collection("users").findOne({ _id: new ObjectId(userId) });
        
        // Se non viene trovato alcun utente con quell'ID, invia un errore
        if (!profileUser) {
            return res.status(404).send("Utente non trovato");
        }
    
        const profilePublicPlaylists = await playlistService.getPublicPlaylistsByUserId(profileUser._id);
        const genres = await spotifyAuth.getGenres();
        const artists = await spotifyAuth.getArtists();
        const likedPlaylists = await userService.getLikedPlaylistsByUserId(profileUser._id);
        const isMe = false;

        res.render("profile", { title: "User Page", isMe, user: req.user, profileUser, genres, artists, profilePlaylists: profilePublicPlaylists, likedPlaylists });
    } catch (error) {
        res.status(500).send("Errore interno del server");
    }
};