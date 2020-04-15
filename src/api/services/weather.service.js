const httpStatus = require("http-status");
const fetch = require("node-fetch");
const { getCurrentPlace } = require('./../helpers/geocode.helper');

module.exports = {
	getGeocode: async (latitude, longitude) => {
		try
		{
			let result;
			const darksky_api_key = process.env.DARK_SKY_KEY;

			const currentPlace = await getCurrentPlace(latitude, longitude);

			await fetch(`https://api.darksky.net/forecast/${darksky_api_key}/${latitude},${longitude}?units=si`)
				.then(res => res.json())
				.then(json =>  {
					result = json;
				})
			return {
				code: httpStatus.OK,
				weather: result,
				currentPlace
			}
		}
		catch(e)
		{
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: 'Fetch weather fail, server error, please again !!!'
			}
		}
	}
};
