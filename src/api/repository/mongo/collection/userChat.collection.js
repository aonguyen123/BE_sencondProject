const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userChatSchema = new Schema({
	idUser: {
		type: Schema.Types.ObjectId,
		ref: 'UserCollection'
	},
	socketId: String
});

userChatSchema.set('timestamps', true);
const userChatCollection = mongoose.model('UserChatCollection', userChatSchema);

module.exports = userChatCollection;
