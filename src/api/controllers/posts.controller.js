const postService = require("./../services/posts.service");

exports.createPost = async (req, res, next) => {
	try {
		const { posts, mentions, idUser, urlImages } = req.body;
		const response = await postService.createPost(
			urlImages,
			idUser,
			mentions,
			posts
		);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (e) {
		next(e);
	}
};
exports.fetchPost = async (req, res, next) => {
	try {
		const { page, page_size } = req.params;
		const response = await postService.fetchPost(page, page_size);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (e) {
		next(e);
	}
};
exports.fetchPostById = async (req, res, next) => {
	try {
		const { id, page, page_size } = req.params;
		if (!id) {
			return res.status(500).json({
				message: "Fetch post by id fail. Id user not found"
			});
		}
		const response = await postService.fetchPostById(id, page, page_size);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (e) {
		next(e);
	}
};
exports.likePost = async (req, res, next) => {
	try {
		const { idUser, idPost } = req.body;
		const response = await postService.likePost(idUser, idPost);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (error) {
		next(error);
	}
};
exports.dislikePost = async (req, res, next) => {
	try {
		const { idUser, idPost } = req.body;
		const response = await postService.dislikePost(idUser, idPost);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (error) {
		next(error);
	}
}
