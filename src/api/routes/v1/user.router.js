const router = require('express').Router();
const userController = require('./../../controllers/user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.route('/search-user').get(authMiddleware, userController.searchUser);
router.route('/fetch-user/:id').get(authMiddleware, userController.fetchUser);

module.exports = router;
