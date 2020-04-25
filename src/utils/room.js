const mongoose = require("mongoose");
const {
	roomCollection,
	statusChatCollection,
	joinChatCollection,
} = require("./../api/repository");
const {
	hashPassword,
	comparePassword,
} = require("./../api/helpers/password.helper");

async function createRoom(roomName, upload, password, _id) {
	roomName.trim();
	const newRoom = new roomCollection({
		roomName,
		roomImage: upload,
		password: password && (await hashPassword(password)),
		userId: _id,
	});
	const doc = await newRoom.save();
	const room = await roomCollection
		.findById(doc._id)
		.populate("userId", "displayName");
	const user = await roomCollection
		.findOne({ userId: _id })
		.populate("userId", "displayName");

	const statusChat = new statusChatCollection({
		displayName: user.userId.displayName,
		text: "created room",
		target: room.roomName,
	});
	const status = await statusChat.save();

	return { status, room };
}
async function joinRoom(idUser, idRoom, password, socketid) {
	const room = await roomCollection.findById(idRoom, "password");
	const match = await comparePassword(room.password, password);
	if (match) {
		const exist = await joinChatCollection.findOne({ idUser, idRoom });
		if (!exist) {
			const newJoin = new joinChatCollection({
				idUser,
				idRoom,
				socketid,
				status: 'offline'
			});
			await newJoin.save();
			return { data: idRoom };
		}
		return { data: idRoom }
	}
	return { error: "Password is not correct" };
}
async function getRoom(idRoom) {
	idRoom = mongoose.Types.ObjectId(idRoom);
	const room = await roomCollection
		.findById(idRoom)
		.populate("userId", "displayName");
	return room;
}
async function updateJoinRoom(idUser, idRoom, socketid) {
	idUser = mongoose.Types.ObjectId(idUser);
	idRoom = mongoose.Types.ObjectId(idRoom);
	const doc = await joinChatCollection.updateOne({idUser, idRoom}, {status: 'online', socketid});
	if(doc) {
		const join = await joinChatCollection.findOne({idUser, idRoom}).populate('idUser', 'displayName photoURL');
		return join;
	}
	return;
}
async function unJoinRoom(idUser, idRoom, socketid) {
	idUser = mongoose.Types.ObjectId(idUser);
	idRoom = mongoose.Types.ObjectId(idRoom);
	const doc = await joinChatCollection.updateOne({idUser, idRoom}, {status: 'offline', socketid});
	if(doc) {
		const join = await joinChatCollection.findOne({idUser, idRoom}).populate('idUser', 'displayName photoURL');
		return join;
	}
	return;
}
async function disconnect(socketid) {
	const doc = await joinChatCollection.updateOne({socketid}, {status: 'offline'});
	if(doc) {
		const join = await joinChatCollection.findOne({socketid}).populate('idUser', 'displayName photoURL');
		return join;
	}
	return;
}

module.exports = {
	createRoom,
	joinRoom,
	getRoom,
	updateJoinRoom,
	unJoinRoom,
	disconnect
};
