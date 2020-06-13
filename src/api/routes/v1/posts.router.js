const router = require("express").Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const postsController = require("./../../controllers/posts.controller");

router.route("/create-posts").post(authMiddleware, postsController.createPost);
router
	.route("/fetch-posts/:id/page=:page&page_size=:page_size")
	.get(authMiddleware, postsController.fetchPost);
router
	.route("/fetch-post-by-id/:id/page=:page&page_size=:page_size")
	.get(authMiddleware, postsController.fetchPostById);
router.route('/likePost').post(authMiddleware, postsController.likePost);
router.route('/dislikePost').post(authMiddleware, postsController.dislikePost);
router.route('/deletePostById').post(authMiddleware, postsController.deletePostById);
router.route('/fetchPostByIdPost').get(authMiddleware, postsController.fetchPostByIdPost);

module.exports = router;
