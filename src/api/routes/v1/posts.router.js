const router = require("express").Router();
const multer = require("multer");
const authMiddleware = require("../../middlewares/auth.middleware");
const postsController = require("./../../controllers/posts.controller");

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

router
	.route("/create-posts")
	.post(
		authMiddleware,
		upload.array("pictures", 8),
		postsController.createPost
	);
router
	.route("/fetch-posts/page=:page&page_size=:page_size")
	.get(authMiddleware, postsController.fetchPost);
router
	.route("/fetch-post-by-id/:id/page=:page&page_size=:page_size")
	.get(postsController.fetchPostById);

module.exports = router;
