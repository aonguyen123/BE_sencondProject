const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
	_id: mongoose.Types.ObjectId,
	idUser: {
		type: Schema.Types.ObjectId,
		ref: 'UserCollection'
	},
	sender: {
		type: Schema.Types.ObjectId,
		ref: 'UserCollection'
	},
	contents: [
		{
			senderId: {
				type: Schema.Types.ObjectId,
				ref: 'UserCollection'
			},
			content: String,
			time: String
		}
	]
});
chatSchema.set('timestamps', true);

const chatCollection = mongoose.model('ChatCollection', chatSchema);
module.exports = chatCollection;
