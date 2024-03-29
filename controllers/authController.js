const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { client } = require('../database/connection');
const validator = require('validator');

exports.register = async (req, res) => {
  const { name, surname, email, password, confirmPassword, artists, genres } = req.body;

  try {
    // Controllo che tutte le informazioni siano state fornite
    if (!name || !surname || !email || !password || !confirmPassword || !artists || !genres) {
      return res.status(400).json({ message: 'Per favore, completa tutti i campi' });
    }

    // Controllo che le password corrispondano
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Le password non corrispondono' });
    }

    // Controllo che la mail sia valida
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'L\'email fornita non è valida' });
    }

    // Controllo che l'utente non sia già registrato
    const existingUser = await client.db("pwm").collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utente con questa email è già registrato' });
    }

    // Creazione dell'utente
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name: name,
      surname: surname,
      email: email,
      password: hashedPassword,
      artists: artists,
      genres: genres,
      likedPlaylists: [] // array di ObjectID vuoto
      };

    const result = await client.db("pwm").collection("users").insertOne(newUser);

    // Ottieni l'ID dell'utente appena inserito
    const userId = result.insertedId;

    // Creazione del token JWT
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '48h'  // Fai scadere il token dopo 48 ore
    });

    // Imposta il token come cookie
    res.cookie('auth_token', token, {
      httpOnly: true, // Il cookie non può essere letto dal JavaScript lato client
      maxAge: 48 * 60 * 60 * 1000, // 48 ore in millisecondi
    });

    res.status(201).json({ message: 'Utente registrato con successo e cookie impostato.' });

  } catch (err) {
    console.error("Errore durante la registrazione:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Controllo che tutte le informazioni siano state fornite
    if (!email || !password) {
      return res.status(400).json({ message: 'Per favore, completa tutti i campi' });
    }

    // Cerco l'utente nel database
    const user = await client.db("pwm").collection("users").findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Nessun account con questa email è stato registrato' });
    }

    // Confronto la password fornita con quella nel database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password non valida' });
    }

    // Creazione del token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '48h'  // Fai scadere il token dopo 48 ore
    });

    // Imposta il JWT in un cookie httpOnly
    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 48, // 48 ore
    });

    res.status(201).json({ message: 'Login effettuato con successo e cookie impostato.' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
