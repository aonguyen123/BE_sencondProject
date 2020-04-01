const router = require('express').Router();
const weatherController = require('./../../controllers/weather.controller');
const authMiddleWare = require('./../../middlewares/auth.middleware');

router.route('/get-geocode').get(authMiddleWare, weatherController.getGeocode);

module.exports = router;
