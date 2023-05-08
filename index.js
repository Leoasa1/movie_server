const express = require('express');
const dataBase = require('./config/db');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;

dataBase();

app.use(cookieParser());
app.use(express.json());
app.use('/movies', require('./routes/movies'));
app.use('/watchlist', require('./routes/watchlist'));

app.get('/', (req, res) => {
	res.send(`Server Running!`);
});

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
