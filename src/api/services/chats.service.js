const mongoose = require('mongoose');
const httpStatus = require("http-status");
const {
	statusChatCollection,
	roomCollection,
	chatCollection,
	joinChatCollection
} = require("./../repository");

module.exports = {
	getStatusChat: async () => {
		try {
			const statusChats = await statusChatCollection
				.find()
				.sort({ _id: "desc" })
				.limit(20);
			statusChats.reverse();
			return {
				code: httpStatus.OK,
				statusChats,
			};
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: "Fetch status chat fail, server error. Try again !!!",
			};
		}
	},
	getRooms: async () => {
		try {
			const rooms = await roomCollection
				.find()
				.populate("userId", "displayName");
			return {
				code: httpStatus.OK,
				rooms,
			};
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: "Fetch rooms fail, server error. Try again !!!",
			};
		}
	},
	getChats: async () => {
		try {
			const chats = await chatCollection
				.find({ idRoom: null })
				.populate("sender", "displayName photoURL");
			return {
				code: httpStatus.OK,
				chats,
			};
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: "Fetch chats fail, server error. Try again !!!",
			};
		}
	},
	checkJoinRoom: async (idRoom, idUser) => {
		try {
			idUser = mongoose.Types.ObjectId(idUser);
			idRoom = mongoose.Types.ObjectId(idRoom);
			const joined = await joinChatCollection.findOne({ idUser, idRoom });
			if(joined) {
				const userRoom = await joinChatCollection.find({idRoom}).populate('idUser', 'displayName photoURL');
				const messageRoom = await chatCollection.find({idRoom}).populate('sender', 'displayName photoURL');
				const room = await roomCollection.findById(idRoom, 'roomName roomImage').populate('userId', 'displayName');
				return {
					code: httpStatus.OK,
					data: { userRoom, messageRoom, room }
				}
			}
			return {
				code: httpStatus.BAD_REQUEST,
				message: 'You haven`t joined the room yet'
			};
		} catch (error) {
			return {
				code: httpStatus.BAD_REQUEST,
				message: 'You haven`t joined the room yet'
			};
		}
	},
};
