const router = require('express').Router();
const commentsController = require('./../../controllers/comment.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.route('/addComment').post(authMiddleware, commentsController.addComment);
router.route('/fetchCommentByIdPost/:idPost').get(authMiddleware, commentsController.fetchCommentByIdPost);

module.exports = router;
