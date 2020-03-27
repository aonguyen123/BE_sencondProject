const router = require('express').Router();
const validate = require('express-validation');
const authValidation = require('./../../validations/auth.validation');
const authController = require('./../../controllers/auth.controller');

router.route('/register').post(authController.register);
router.route('/login').post(validate(authValidation.login), authController.login);
router.route('/refreshToken').post(validate(authValidation.refreshToken), authController.refreshToken);


module.exports = router;
