const eventsService = require('./../services/events.service');

exports.fetchEvents = async (req, res, next) => {
	try {
		const { idUser } = req.query;
		const response = await eventsService.fetchEvents(idUser);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (error) {
		next(error);
	}
}
exports.removeEvent = async (req, res, next) => {
	try {
		const { idEvent } = req.body;
		const response = await eventsService.removeEvent(idEvent);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (error) {
		next(error);
	}
}
exports.removeAllEvents = async (req, res, next) => {
	try {
		const { eventType } = req.body;
		const response = await eventsService.removeAllEvents(eventType);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (error) {
		next(error);
	}
}
exports.fetchHistorys = async (req, res, next) => {
	try {
		const { idUser, page, page_size } = req.query;
		const response = await eventsService.fetchHistorys(idUser, page, page_size);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (error) {
		next(error)
	}
}
