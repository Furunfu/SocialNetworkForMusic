require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { connectToDatabase } = require('./database/connection');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const playlistRoutes = require('./routes/playlists');
const searchRoutes = require('./routes/search');
const pagesRoutes = require('./routes/pages');

const app = express();

connectToDatabase();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/search', searchRoutes);

app.use('/', pagesRoutes);

app.listen(3000);