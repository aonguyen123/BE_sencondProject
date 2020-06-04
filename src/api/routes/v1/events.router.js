const router = require('express').Router();
const eventsController = require('./../../controllers/events.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.route('/fetchEvents').get(authMiddleware, eventsController.fetchEvents);
router.route('/removeEvent').post(authMiddleware, eventsController.removeEvent);
router.route('/removeAllEvents').post(authMiddleware, eventsController.removeAllEvents);
router.route('/fetchHistorys').get(authMiddleware, eventsController.fetchHistorys);

module.exports = router;
