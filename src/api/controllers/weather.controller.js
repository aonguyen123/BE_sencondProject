const httpStatus = require("http-status");
const weatherService = require("./../services/weather.service");
const responseService = require("./../services/response.service");

exports.getWeather = async (req, res, next) => {
	try {
		const { query } = req.query;
		const { getWeather } = weatherService;
		const result = await getWeather(query);
		if (result.code === 500) {
			return res
				.status(httpStatus.INTERNAL_SERVER_ERROR)
				.json(responseService.server_error());
		}
		return res.status(httpStatus.OK).json(result.payload);
	} catch (e) {
		next(e);
	}
};
exports.getGeocode = async (req, res, next) => {
	try {
		const { latitude, longitude } = req.query;
		const { getGeocode } = weatherService;
		const result = await getGeocode(latitude, longitude);
		if (result.code === 500) {
			return res
				.status(httpStatus.INTERNAL_SERVER_ERROR)
				.json(responseService.server_error());
		}
		return res.status(httpStatus.OK).json(result.payload);
	}
	catch(e)
	{
		next(e);
	}
};
