const {
	userChatCollection,
	statusChatCollection,
} = require("./../api/repository");

async function addUserChat(_id, socketId) {
	const newUserChat = new userChatCollection({
		idUser: _id,
		socketId,
	});
	const doc = await newUserChat.save();
	const userChat = await userChatCollection
		.findById(doc._id)
		.populate("idUser", "displayName photoURL");
	return {userChat};
}
async function removeUserChat(socketId) {
	const doc = await userChatCollection.deleteOne({ socketId });
	if(doc) {
		return doc;
	}
	return;
}
async function getUser(socketId) {
	const user = await userChatCollection.findOne({ socketId }).populate('idUser', 'displayName');
	return user;
}

module.exports = {
	addUserChat,
	removeUserChat,
	getUser,
};
