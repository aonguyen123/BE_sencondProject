const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const joinChatSchema = new Schema({
	idUser: {
		type: Schema.Types.ObjectId,
		ref: 'UserCollection'
	},
	idRoom: {
		type: Schema.Types.ObjectId,
		ref: 'RoomCollection'
	},
	socketid: String,
	status: String
});
joinChatSchema.set('timestamps', true);
joinChatSchema.index({idUser: 1, idRoom: -1}, {name: 'query_join_room'});

const joinChatCollection = mongoose.model('JoinChatCollection', joinChatSchema);
module.exports = joinChatCollection;
