const router = require('express').Router();
const userController = require('./../../controllers/user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.route('/search-user').get(authMiddleware, userController.searchUser);
router.route('/fetch-user/:id').get(authMiddleware, userController.fetchUser);
router.route('/fetch-user-by-id/:id').get(authMiddleware, userController.fetchUserById);
router.route('/updatePhotoURL').post(authMiddleware, userController.updatePhotoURL);
router.route('/updateProfile').post(authMiddleware, userController.updateProfile);
router.route('/updatePass').post(authMiddleware, userController.updatePassword);
router.route('/updateInterest').post(authMiddleware, userController.updateInterest);
router.route('/removeInterest').post(authMiddleware, userController.removeInterest);

module.exports = router;
