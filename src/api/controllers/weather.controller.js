const httpStatus = require("http-status");
const weatherService = require("./../services/weather.service");
const responseService = require("./../services/response.service");

exports.getGeocode = async (req, res, next) => {
	try {
		const { latitude, longitude } = req.query;
		const { getGeocode } = weatherService;
		const result = await getGeocode(latitude, longitude);
		const { code, ...rest } = result;
		if (code === 500) {
			return res
				.status(httpStatus.INTERNAL_SERVER_ERROR)
				.json(responseService.server_error());
		}
		return res.status(httpStatus.OK).json(rest);
	}
	catch(e)
	{
		next(e);
	}
};
