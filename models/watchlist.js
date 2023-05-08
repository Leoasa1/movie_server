const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const watchlistSchema = new Schema({
	host: {
		type: String,
		required: true,
	},
	movies: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Movie',
		},
	],
	votes: [
		{
			type: Schema.Types.ObjectId,
			ref: 'MovieVote',
		},
	],
	uuids: [
		{
			type: String,
		},
	],
	movienightDate: {
		type: Date,
		required: true
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const Watchlist = mongoose.model('Watchlist', watchlistSchema);
module.exports = Watchlist;
