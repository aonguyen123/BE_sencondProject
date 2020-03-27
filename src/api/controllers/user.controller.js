const httpStatus = require("http-status");
const userService = require("./../services/user.service");

exports.searchUser = async (req, res, next) => {
	try {
		const { q } = req.query;
		if (q) {
			const response = await userService.searchUser(q);
			const { data } = response;
			return res.status(httpStatus.OK).json(data);
		}
	} catch (e) {
		next(e);
	}
};
exports.fetchUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		const response = await userService.fetchUser(id);
		const { code, ...rest } = response;
		if(code === httpStatus.INTERNAL_SERVER_ERROR)
		{
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(rest);
		}
		if(code === httpStatus.OK)
		{
			return res.status(httpStatus.OK).json(rest);
		}
	} catch (e) {
		next(e);
	}
};

exports.uploadAvatar = async (req, res, next) => {
	console.log(req.body)
	console.log(req.files)
}
