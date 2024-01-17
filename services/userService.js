const { client } = require('../database/connection');
const { getPlaylistById } = require('./playlistService');
const { ObjectId } = require('mongodb');

async function getUserById(userId) {
    const db = client.db('pwm');
    const collection = db.collection('users');
    return await collection.findOne({ _id: new ObjectId(userId) });
}

async function getLikedPlaylistsByUserId(userId) {
    const user = await getUserById(userId);

    if (!user || !Array.isArray(user.likedPlaylists) || user.likedPlaylists.length === 0) {
        // L'utente non esiste o non ha playlist a cui ha messo "mi piace"
        return [];
    }

    // Recupera le informazioni dettagliate per ciascuna playlist utilizzando la funzione getPlaylistById
    const likedPlaylistsDetails = [];
    for (const playlistId of user.likedPlaylists) {
        const playlistDetails = await getPlaylistById(playlistId.toString());
        if (playlistDetails) { // Controlla se la playlist esiste
            likedPlaylistsDetails.push(playlistDetails);
        }
    }

    return likedPlaylistsDetails;
}

module.exports = {
    getUserById,
    getLikedPlaylistsByUserId
};