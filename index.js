const express = require('express');
const dataBase = require('./config/db');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;

dataBase();

app.use((req, res, next) => {
	res.header(
		'Access-Control-Allow-Origin',
		'https://www.moovinight.com',
		'https://moovinight.com'
	); // Replace * with the origin(s) you want to allow
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});
app.use(cookieParser());
app.use(express.json());
app.use('/movies', require('./routes/movies'));
app.use('/watchlist', require('./routes/watchlist'));

app.get('/', (req, res) => {
	res.send(`Server Running!`);
});

app.listen(
	port,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${port}`
	)
);
