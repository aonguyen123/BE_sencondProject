const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
	sender: {
		type: Schema.Types.ObjectId,
		ref: 'UserCollection'
	},
	message: String,
	idRoom: {
		type: Schema.Types.ObjectId,
		ref: 'RoomCollection'
	}
});
chatSchema.set('timestamps', true);

const chatCollection = mongoose.model('ChatCollection', chatSchema);
module.exports = chatCollection;
