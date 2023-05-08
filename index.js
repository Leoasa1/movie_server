const express = require('express');
const dataBase = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

const isProduction = process.env.NODE_ENV === 'production';
const origin = isProduction
	? 'https://movie-night.app'
	: 'http://localhost:3000';
const port = process.env.PORT || 5000;

dataBase();

app.use(cors({ credentials: true, origin }));
app.use(cookieParser());
app.use(express.json());
app.use('/movies', require('./routes/movies'));
app.use('/watchlist', require('./routes/watchlist'));

app.get('/', (req, res) => {
	res.send(`Server Running! Is in Production: ${isProduction}`);
});

app.listen(port, () => {
	console.log(
		`Server listening at http://localhost:${port} in ${
			isProduction ? 'production' : 'development'
		} mode`
	);
});
