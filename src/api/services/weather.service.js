const httpStatus = require("http-status");
const fetch = require("node-fetch");
const nodeGeocoder = require('node-geocoder');

module.exports = {
	getWeather: async (query) => {
		try {
			let result;
			const darksky_api_key = process.env.DARK_SKY_KEY;

			const options = {
				provider: "google",
				httpAdapter: 'https',
				formatter: null,
				apiKey: process.env.GOOGLE_MAP_API_KEY
			}
			console.log(query)

			const geocoder = nodeGeocoder(options);
			await geocoder.reverse({lat: 14.058324, lon: 108.277199}).then(res => {
				result = res;
			})
			return {
				code: httpStatus.OK,
				payload: result
			}
			// const { latitude, longitude } = rs[0];

			// console.log(latitude, longitude)

			// await fetch(`https://api.darksky.net/forecast/${darksky_api_key}/14.058324,108.277199`)
			// 	.then(res => res.json())
			// 	.then(json =>  {
			// 		result = json;
			// 	})
			// return {
			// 	code: httpStatus.OK,
			// 	payload: result
			// };
		} catch (e) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR
			};
		}
	},
	getGeocode: async (query) => {
		try
		{
			const options = {
				provider: "openstreetmap",
				httpAdapter: 'https',
				formatter: null
			}
			const geocoder = nodeGeocoder(options);
			const rs = await geocoder.geocode(query);
			return {
				code: httpStatus.OK,
				payload: rs[0]
			};
		}
		catch(e)
		{
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR
			}
		}
	}
};
