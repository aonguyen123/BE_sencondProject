const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const statusChatSchema = new Schema({
	displayName: String,
	text: String,
	target: {
		type: String,
		default: ''
	}
});

statusChatSchema.set('timestamps', true);
const statusChatCollection = mongoose.model('StatusChatCollection', statusChatSchema);

module.exports = statusChatCollection;
