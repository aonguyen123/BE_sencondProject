const chatsService = require('./../services/chats.service');

exports.getStatusChat = async (req, res, next) => {
	try {
		const response = await chatsService.getStatusChat();
		const { code, ...rest } = response;
		if(code === 500) {
			return res.status(500).json(rest);
		}
		return res.status(200).json(rest);
	} catch (error) {
		next(error);
	}
}
exports.getRooms = async (req, res, next) => {
	try {
		const response = await chatsService.getRooms();
		const { code, ...rest } = response;
		if(code === 500) {
			return res.status(500).json(rest);
		}
		return res.status(200).json(rest);
	} catch (error) {
		next(error);
	}
}
exports.getChats = async (req, res, next) => {
	try {
		const response = await chatsService.getChats();
		const { code, ...rest } = response;
		if(code === 500) {
			return res.status(500).json(rest);
		}
		return res.status(200).json(rest);
	} catch (error) {
		next(error);
	}
}
exports.checkJoinRoom = async (req, res, next) => {
	try {
		const { idRoom, idUser } = req.params;

		const response = await chatsService.checkJoinRoom(idRoom, idUser);
		const { code, ...rest } = response;
		if(code === 400) {
			return res.status(400).json(rest);
		}
		return res.status(200).json(rest);
	} catch (error) {
		next(error);
	}
}
