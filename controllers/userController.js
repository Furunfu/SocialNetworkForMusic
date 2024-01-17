const { client } = require('../database/connection');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;
const playlistService = require('../services/playlistService');
const validator = require('validator');


exports.getMe = async (req, res) => {
    try {
        const user = await client.db('pwm').collection('users').findOne({ _id: new ObjectId(req.userId) });
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato.' });
        }

        const { name, surname, email } = user;
        return res.json({ name, surname, email });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Errore interno del server.' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await client.db('pwm').collection('users').deleteOne({ _id: new ObjectId(req.userId) });
        res.cookie('auth_token', '', { expires: new Date(0) });
        res.json({ message: 'Account eliminato con successo.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Errore nell\'eliminazione dell\'account.' });
    }
};

exports.updateData = async (req, res) => {
    const { name, surname, email, password, artists, genres } = req.body;
    var updUser = {
        name: name,
        surname: surname,
        artists: artists,
        genres: genres
    };

    try {

        // Controllo che tutte le informazioni siano state fornite
        if (!name || !surname || !artists || !genres) {
            return res.status(400).json({ message: 'Per favore, completa tutti i campi' });
        }
        if (email) {
            if (!validator.isEmail(email)) {
                return res.status(400).json({ message: 'L\'email fornita non è valida' });
            }

            // Controllo che l'utente non sia già registrato
            const existingUser = await client.db("pwm").collection("users").findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Un utente con questa email è già registrato' });
            }
            updUser.email = email;
        }
        
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updUser.password = hashedPassword;
        } 
        
        await client.db('pwm').collection('users').updateOne({ _id: new ObjectId(req.userId) },{ $set: updUser });

        res.json({ message: 'Dati aggiornati con successo.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating data.' });
    }
};

exports.likesHandler = (type, action) => {
    return async (req, res) => {
        const itemId = req.params.id;

        // Le playlist sono nel DB MongoDB, controllo la validità dell'ID. (Non sto controllando l'esistenza della playlist)
        if (!ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: 'ID non valido.' });
        }

        const fieldToUpdate = `likedPlaylists`;

        let updateAction;
        if (action === 'like') {
            // Se stai lavorando con playlist, usa ObjectId, altrimenti trattalo come stringa.
            const idToUse = new ObjectId(itemId);
            updateAction = { $addToSet: { [fieldToUpdate]: idToUse } };
        } else if (action === 'unlike') {
            // Se stai lavorando con playlist, usa ObjectId, altrimenti trattalo come stringa.
            const idToUse = new ObjectId(itemId);
            updateAction = { $pull: { [fieldToUpdate]: idToUse } };
        }

        try {
            const result = await client.db('pwm').collection('users').updateOne(
                { _id: new ObjectId(req.userId) },
                updateAction
            );

            if (result.matchedCount === 0) {
                throw new Error('User not found');
            }

            res.json({ message: `${action.charAt(0).toUpperCase() + action.slice(1)} effettuato con successo.` });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: `Errore nell'esecuzione dell'azione ${action} su ${type}.` });
        }
    }
};
