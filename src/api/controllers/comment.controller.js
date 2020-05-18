const commentsService = require('./../services/comments.service');

exports.addComment = async (req, res, next) => {
	try {
		const { idPost, idUser, content } = req.body;

		const response = await commentsService.addComment(idPost, idUser, content);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (error) {
		next(error);
	}
}
exports.fetchCommentByIdPost = async (req, res, next) => {
	try {
		const { idPost } = req.params;
		const response = await commentsService.fetchCommentByIdPost(idPost);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (error) {
		next(error);
	}
}
