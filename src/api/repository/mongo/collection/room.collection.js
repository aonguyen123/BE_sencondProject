const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
	roomName: String,
	roomImage: String,
	password: String,
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'UserCollection'
	}
});

roomSchema.set('timestamps', true);
const roomCollection = mongoose.model('RoomCollection', roomSchema);
module.exports = roomCollection;
