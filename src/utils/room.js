const mongoose = require("mongoose");
const { roomCollection, joinChatCollection, chatCollection } = require("./../api/repository");
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

	return { room };
}
async function joinRoom(idUser, idRoom, password, socketid) {
	if (!password) {
		const exist = await joinChatCollection
			.findOne({ idUser, idRoom })
			.populate("idRoom", "roomName");
		if (!exist) {
			const newJoin = new joinChatCollection({
				idUser,
				idRoom,
				socketid,
				status: "offline",
			});
			const doc = await newJoin.save();
			const room = await joinChatCollection
				.findById(doc._id)
				.populate("idRoom", "roomName");
			return { data: room };
		}
		return { data: exist };
	} else {
		const room = await roomCollection.findById(idRoom, "password");
		const match = await comparePassword(room.password, password);
		if (match) {
			const exist = await joinChatCollection
				.findOne({ idUser, idRoom })
				.populate("idRoom", "roomName");
			if (!exist) {
				const newJoin = new joinChatCollection({
					idUser,
					idRoom,
					socketid,
					status: "offline",
				});
				const doc = await newJoin.save();
				const room = await joinChatCollection
					.findById(doc._id)
					.populate("idRoom", "roomName");
				return { data: room };
			}
			return { data: exist };
		}
		return { error: "Password is not correct" };
	}
}
async function updateJoinRoom(idUser, idRoom, socketid) {
	idUser = mongoose.Types.ObjectId(idUser);
	idRoom = mongoose.Types.ObjectId(idRoom);
	const doc = await joinChatCollection.updateOne(
		{ idUser, idRoom },
		{ status: "online", socketid }
	);
	if (doc) {
		const join = await joinChatCollection
			.findOne({ idUser, idRoom })
			.populate("idUser", "displayName photoURL")
			.populate("idRoom", "roomName");
		return join;
	}
	return;
}
async function unJoinRoom(idUser, idRoom, socketid) {
	idUser = mongoose.Types.ObjectId(idUser);
	idRoom = mongoose.Types.ObjectId(idRoom);
	const doc = await joinChatCollection.updateOne(
		{ idUser, idRoom },
		{ status: "offline", socketid }
	);
	if (doc) {
		const join = await joinChatCollection
			.findOne({ idUser, idRoom })
			.populate("idUser", "displayName photoURL");
		return join;
	}
	return;
}
async function disconnect(socketid) {
	const doc = await joinChatCollection.updateOne(
		{ socketid },
		{ status: "offline" }
	);
	if (doc) {
		const join = await joinChatCollection
			.findOne({ socketid })
			.populate("idUser", "displayName photoURL");
		return join;
	}
	return;
}
async function leaveRoom(idRoom, idUser) {
	const doc = await joinChatCollection.findOneAndDelete({idRoom, idUser}).populate('idUser', 'displayName');
	if(doc) {
		return doc;
	}
}
async function deleteRoom(idRoom) {
	idRoom = mongoose.Types.ObjectId(idRoom);
	const doc = await roomCollection.findByIdAndDelete(idRoom);
	await joinChatCollection.deleteMany({idRoom});
	await chatCollection.deleteMany({idRoom});
	return doc;
}

module.exports = {
	createRoom,
	joinRoom,
	updateJoinRoom,
	unJoinRoom,
	disconnect,
	leaveRoom,
	deleteRoom
};
