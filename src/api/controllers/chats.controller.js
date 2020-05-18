const chatsService = require('./../services/chats.service');

exports.getRooms = async (req, res, next) => {
	try {
		const response = await chatsService.getRooms();
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (error) {
		next(error);
	}
}
exports.getChats = async (req, res, next) => {
	try {
		const response = await chatsService.getChats();
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (error) {
		next(error);
	}
}
exports.checkJoinRoom = async (req, res, next) => {
	try {
		const { idRoom, idUser } = req.params;

		const response = await chatsService.checkJoinRoom(idRoom, idUser);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (error) {
		next(error);
	}
};
exports.fetchMessageRoom = async (req, res, next) => {
	try {
		const { idRoom, page, page_size } = req.params;
		console.log(idRoom, page_size, page);

		// const response = await chatsService.checkJoinRoom(idRoom, idUser);
		// const { code, ...rest } = response;
		// return res.status(code).json(rest);
	} catch (error) {
		next(error)
	}
}
