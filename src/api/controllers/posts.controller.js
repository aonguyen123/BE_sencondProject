const httpStatus = require("http-status");
const postService = require("./../services/posts.service");
const responseService = require("./../services/response.service");

exports.createPost = async (req, res, next) => {
	try {

		const reqFiles = [];
		let { idUser, mentionList, posts } = req.body;
		if(typeof mentionList === 'string')
		{
			mentionList = [mentionList];
		}
		const url = req.protocol + "://" + req.get("host");
		for (let i = 0; i < req.files.length; i++) {
			reqFiles.push(url + "/public/" + req.files[i].filename);
		}

		const response = await postService.createPost(reqFiles, idUser, mentionList, posts);
		const { code, ...rest } = response;
		if(code === httpStatus.BAD_REQUEST)
		{
			return res.status(httpStatus.BAD_REQUEST).json(rest);
		}
		if(code === httpStatus.OK)
		{
			return res.status(httpStatus.OK).json(rest);
		}
		if(code === httpStatus.INTERNAL_SERVER_ERROR)
		{
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(responseService.server_error().message);
		}
	} catch (e) {
		next(e);
	}
};
exports.fetchPost = async (req, res, next) => {
	try {
		const { page, page_size } = req.params;
		const response = await postService.fetchPost(page, page_size);
		const { code, ...rest } = response;
		if (code === httpStatus.OK) {
			return res.status(httpStatus.OK).json(rest);
		}
		if (code === httpStatus.BAD_REQUEST) {
			return res.status(httpStatus.BAD_REQUEST).json(rest);
		}
		if (code === httpStatus.INTERNAL_SERVER_ERROR) {
			return res
				.status(httpStatus.INTERNAL_SERVER_ERROR)
				.json(responseService.server_error().message);
		}
	} catch (e) {
		next(e);
	}
};
exports.fetchPostById = async (req, res, next) => {
	try {
		const { id, page, page_size } = req.params;
		if(!id)
		{
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
				message: 'Id user not found'
			});
		}
		const response = await postService.fetchPostById(id, page, page_size);
		const { code, ...rest } = response;
		if (code === httpStatus.OK) {
			return res.status(httpStatus.OK).json(rest);
		}
		if (code === httpStatus.BAD_REQUEST) {
			return res.status(httpStatus.BAD_REQUEST).json(rest);
		}
		if (code === httpStatus.INTERNAL_SERVER_ERROR) {
			return res
				.status(httpStatus.INTERNAL_SERVER_ERROR)
				.json(responseService.server_error().message);
		}
	} catch (e) {
		next(e)
	}
}
