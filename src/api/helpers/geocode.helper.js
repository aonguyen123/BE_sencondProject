const nodeGeocoder = require('node-geocoder');
const options = require('./../../config/geocode.config');

const getCurrentPlace = async (latitude, longitude) => {
	const geocoder = nodeGeocoder(options);
	const result = await geocoder.reverse({lat: latitude, lon: longitude});
	return result[0].formattedAddress;
}

module.exports = {
	getCurrentPlace
}
