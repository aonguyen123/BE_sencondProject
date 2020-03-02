const httpStatus = require("http-status");
const fetch = require("node-fetch");
const { getCurrentPlace } = require('./../helpers/geocode.helper');

module.exports = {
	getWeather: async (query) => {
		// try {
			// let result;
			// const darksky_api_key = process.env.DARK_SKY_KEY;

			// const options = {
			// 	provider: "openstreetmap",
			// 	httpAdapter: 'https',
			// 	formatter: null,
			// 	//apiKey: process.env.GOOGLE_MAP_API_KEY
			// }

		// 	const geocoder = nodeGeocoder(options);
		// 	const rs = await geocoder.geocode(query);
		// 	const { latitude, longitude } = rs[0];

		// 	console.log(latitude, longitude)

		// 	geocoder.reverse({lat: latitude, lon: longitude}).then(res => {
		// 		console.log(res);
		// 	})

		// 	await fetch(`https://api.darksky.net/forecast/${darksky_api_key}/${latitude},${longitude}`)
		// 		.then(res => res.json())
		// 		.then(json =>  {
		// 			result = json;
		// 		})
		// 	return {
		// 		code: httpStatus.OK,
		// 		payload: result
		// 	};
		// } catch (e) {
		// 	return {
		// 		code: httpStatus.INTERNAL_SERVER_ERROR
		// 	};
		// }
	},
	getGeocode: async (latitude, longitude) => {
		try
		{
			const result = await getCurrentPlace(latitude, longitude);
			return {
				code: httpStatus.OK,
				payload: result
			}
		}
		catch(e)
		{
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR
			}
		}
	}
};
