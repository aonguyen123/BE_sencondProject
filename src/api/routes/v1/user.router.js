const router = require('express').Router();
const multer = require("multer");
const userController = require('./../../controllers/user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const DIR = "./public/uploads/";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, DIR);
	},
	filename: (req, file, cb) => {
		const fileName = file.originalname
			.toLowerCase()
			.split(" ")
			.join("-");
		cb(null, "IMAGE-" + Date.now() + fileName);
	}
});

var upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == "image/png" ||
			file.mimetype == "image/jpg" ||
			file.mimetype == "image/jpeg"
		) {
			cb(null, true);
		} else {
			cb(null, false);
		}
	}
});

router.route('/search-user').get(userController.searchUser);
router.route('/fetch-user/:id').get(authMiddleware, userController.fetchUser);
router.route('/upload-avatar').post(authMiddleware, userController.uploadAvatar);

module.exports = router;
