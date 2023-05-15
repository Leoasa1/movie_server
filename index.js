const express = require('express');
const dataBase = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;

dataBase();

const allowedOrigins = [
	'https://www.moovinight.com',
	'https://moovinight.com',
	'http://localhost:3000',
];

app.use(
	cors({
		origin: function (origin, callback) {
			// allow requests with no origin (like mobile apps or curl requests)
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				var msg =
					'The CORS policy for this site does not ' +
					'allow access from the specified Origin.';
				return callback(new Error(msg), false);
			}
			return callback(null, true);
		},
		credentials: true,
	})
);

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
