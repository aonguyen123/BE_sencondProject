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
	const statusChat = new statusChatCollection({
		displayName: userChat.idUser.displayName,
		text: "has joined",
	});
	const data = await statusChat.save();
	return {data, userChat};
}
async function removeUserChat(socketId) {
	try {
		const data = await userChatCollection
		.findOne({ socketId })
		.populate("idUser", "displayName");
		if(data) {
			const statusChat = new statusChatCollection({
				displayName: data.idUser.displayName,
				text: "has left",
			});
			const doc = await statusChat.save();
			await userChatCollection.deleteOne({ socketId });
			return doc;
		}
	} catch (error) {

	}
}
async function getUser(socketId) {
	const user = await userChatCollection.findOne({ socketId });
	return user;
}

module.exports = {
	addUserChat,
	removeUserChat,
	getUser,
};
