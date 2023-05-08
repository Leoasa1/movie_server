const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieVoteSchema = new Schema({
	movie: {
		type: Schema.Types.ObjectId,
		ref: 'Movie',
	},
	user: {
		type: String,
	},
	vote: Number,
});
const MovieVote = mongoose.model('MovieVote', movieVoteSchema);
module.exports = MovieVote;