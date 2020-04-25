const { chatCollection } = require('./../api/repository');

async function addMessage(idUser, message, idRoom) {
	const newMessage = new chatCollection({
		sender: idUser,
		message,
		idRoom
	});
	const doc = await newMessage.save();
	const mes = await chatCollection.findById(doc._id).populate('sender', 'displayName photoURL');
	return mes;
}

module.exports = {
	addMessage
}
