const express = require('express');
const Axios = require('axios');

const router = express.Router();

const getRandomMovies = async () => {
	const genresList = [
		'Drama',
		'Thriller',
		'Comedy',
		'Fantasy',
		'Romance',
		'Action',
		'Mystery',
		'Crime',
		'Adventure',
		'Horror',
		'Sci-Fi',
		'Animation',
		'Western',
	];
	const randomGenre =
		genresList[Math.floor(Math.random() * genresList.length)];

	const optionsIds = {
		method: 'GET',
		url: `https://moviesminidatabase.p.rapidapi.com/movie/byGen/${randomGenre}`,
		headers: {
			'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
			'X-RapidAPI-Host': 'moviesminidatabase.p.rapidapi.com',
		},
	};

	const movieIds = await Axios.request(optionsIds)
		.then((response) => {
			return response.data.results;
		})
		.catch(function (error) {
			return console.error(error);
		});

	const idsList = movieIds.map((item) => {
		return item.imdb_id;
	});
	idsList.splice(24);

	const optionsDetails = {
		method: 'GET',
		url: 'https://moviesdatabase.p.rapidapi.com/titles/x/titles-by-ids',
		params: {
			idsList: `${idsList.toString()}`,
		},
		headers: {
			'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
			'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
		},
	};

	const movies = await Axios.request(optionsDetails)
		.then((response) => {
			return response.data.results;
		})
		.catch(function (error) {
			return console.error(error);
		});

	return { randomGenre, movies };
};

const getMovieByGenre = async (genre) => {
	const optionsIds = {
		method: 'GET',
		url: `https://moviesminidatabase.p.rapidapi.com/movie/byGen/${genre}`,
		headers: {
			'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
			'X-RapidAPI-Host': 'moviesminidatabase.p.rapidapi.com',
		},
	};

	const movieIds = await Axios.request(optionsIds)
		.then((response) => {
			return response.data.results;
		})
		.catch(function (error) {
			return console.error(error);
		});

	const idsList = movieIds.map((item) => {
		return item.imdb_id;
	});
	idsList.splice(24);

	const optionsDetails = {
		method: 'GET',
		url: 'https://moviesdatabase.p.rapidapi.com/titles/x/titles-by-ids',
		params: {
			idsList: `${idsList.toString()}`,
		},
		headers: {
			'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
			'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
		},
	};
	return await Axios.request(optionsDetails)
		.then((response) => {
			return response.data.results;
		})
		.catch(function (error) {
			return console.error(error);
		});
};

router.get('/random', async (req, res) => {
	try {
		const getData = await getRandomMovies();
		res.status(200).json(getData);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

router.get('/search-by-genre', async (req, res) => {
	const genre = req.query.genre;
	try {
		const getData = await getMovieByGenre(genre);
		res.status(200).json(getData);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
})


module.exports = router;
