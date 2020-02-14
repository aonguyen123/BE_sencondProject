const router = require('express').Router();
const weatherController = require('./../../controllers/weather.controller');

router.route('/get-weather').get(weatherController.getWeather);
router.route('/get-geocode').get(weatherController.getGeocode);

module.exports = router;
