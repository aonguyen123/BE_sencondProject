const weatherService = require("./../services/weather.service");

exports.getGeocode = async (req, res, next) => {
	try {
		const { latitude, longitude } = req.query;
		const { getGeocode } = weatherService;
		const result = await getGeocode(latitude, longitude);
		const { code, ...rest } = result;
		return res.status(code).json(rest);

	}
	catch(e)
	{
		next(e);
	}
};
