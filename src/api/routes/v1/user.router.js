const router = require('express').Router();
const validate = require('express-validation');

const userController = require('./../../controllers/user.controller');
const userValidation = require('./../../validations/user.validation');
const authMiddleware = require('../../middlewares/auth.middleware');

//un protected route
//router.route('/greet-me').get(validate(userValidation.me), userController.me);

//protected route
router.route('/greet-me-protected').get(authMiddleware, userController.me);

module.exports = router;
