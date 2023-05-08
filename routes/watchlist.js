const express = require('express');
const Movie = require('../models/movie');
const MovieVote = require('../models/movieVote');
const Watchlist = require('../models/watchlist');
const Axios = require('axios');

const router = express.Router();

const getMovieDetails = async (movieId) => {
	const options = {
		method: 'GET',
		url: `https://moviesminidatabase.p.rapidapi.com/movie/id/${movieId}`,
		headers: {
			'content-type': 'application/octet-stream',
			'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
			'X-RapidAPI-Host': 'moviesminidatabase.p.rapidapi.com',
		},
	};
	try {
		const response = await Axios.request(options);
		return response.data.results;
	} catch (error) {
		return error;
	}
};

router.get('/', async (req, res) => {
	const watchlistId = req.query.watchlistId;
	const uuid = req.cookies.uuid;

	try {
		const watchlist = await Watchlist.findById(watchlistId)
			.populate({
				path: 'movies',
				model: 'Movie',
			})
			.populate({
				path: 'votes',
				model: 'MovieVote',
				populate: {
					path: 'movie',
					model: 'Movie',
				},
			});

		if (!watchlist) {
			return res.status(404).json({ message: 'Watchlist not found' });
		}

		const movieDetailsPromises = watchlist.movies.map((movie) =>
			getMovieDetails(movie.imdb_id)
		);
		const movieList = await Promise.all(movieDetailsPromises);

		const canVote = watchlist.uuids.includes(uuid) ? false : true;

		// Extract the votes with movie title and user
		const allVotes = watchlist.votes.map((vote) => {
			return {
				movieTitle: vote.movie.title,
				user: vote.user,
				vote: vote.vote,
			};
		});

		res.status(200).json({
			canVote,
			host: watchlist.host,
			movienightDate: watchlist.movienightDate,
            dateCreated: watchlist.date,
			movieList,
			allVotes,
		});
	} catch (error) {
		console.error('Error fetching movie details:', error);
		res.status(500).json({ message: 'Error fetching movie details' });
	}
});


router.put('/vote', async (req, res) => {
    const { imdb_id, user, vote, watchlistId } = req.body;
    const uuid = req.cookies.uuid; // Extract the uuid from the cookies

    try {
        // Find the watchlist by watchlistId
        const watchlist = await Watchlist.findById(watchlistId);
        if (!watchlist) {
            return res.status(404).json({ message: 'Watchlist not found' });
        }

        // Find the movie by imdb_id
        const movie = await Movie.findOne({ imdb_id });
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Create a new MovieVote instance
        const newVote = new MovieVote({ movie: movie._id, user, vote });

        // Save the new vote to the database
        await newVote.save();

        // Add the new vote's _id to the watchlist's votes array
        watchlist.votes.push(newVote._id);

        // Add the uuid to the watchlist's uuids array
        if (!watchlist.uuids.includes(uuid)) {
            watchlist.uuids.push(uuid);
        }

        // Save the updated watchlist to the database
        await watchlist.save();

        res.status(200).json({ message: 'Vote added successfully', watchlist });
    } catch (error) {
        console.error('Error adding vote:', error);
        res.status(500).json({ message: 'Error adding vote' });
    }
});


router.post('/create', async (req, res) => {
    const { movies, host, movieNightDate } = req.body;

	try {
		// Save movies to the database
		const savedMovies = await Promise.all(
			movies.map((movie) => {
				const newMovie = new Movie({
					title: movie.title,
					imdb_id: movie.imdb_id,
				});
				return newMovie.save();
			})
		);

		// Create a new watchlist
		const newWatchlist = new Watchlist({
			host,
			movies: savedMovies.map((movie) => movie._id),
			uuids: [],
			movienightDate: movieNightDate
				? new Date(movieNightDate)
				: undefined,
		});

		// Save the watchlist to the database
		await newWatchlist.save();

		res.status(200).json({
			message: 'Watchlist created successfully',
			watchlist: newWatchlist.id,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error creating watchlist' });
	}
});

module.exports = router;
