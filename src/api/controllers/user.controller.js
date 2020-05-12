const httpStatus = require("http-status");
const userService = require("./../services/user.service");

exports.searchUser = async (req, res, next) => {
	try {
		const { q } = req.query;
		if (q) {
			const response = await userService.searchUser(q);
			const { code, ...rest } = response;
			return res.status(code).json(rest);
		}
	} catch (e) {
		next(e);
	}
};
exports.fetchUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res
				.status(httpStatus.BAD_REQUEST)
				.json({
					message:
						"Fetch user fail. Id user not found, try again !!!",
				});
		}
		const response = await userService.fetchUser(id);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (e) {
		next(e);
	}
};
exports.fetchUserById = async (req, res, next) => {
	try {
		const { id } = req.params;
		const response = await userService.fetchUserById(id);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (error) {
		next(error);
	}
};
exports.updatePhotoURL = async (req, res, next) => {
	try {
		const { photoURL, idUser } = req.body;

		const response = await userService.updatePhotoURL(photoURL, idUser);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (error) {
		next(error);
	}
};
exports.updateProfile = async (req, res, next) => {
	try {
		const { data, idUser } = req.body;
		const response = await userService.updateProfile(data, idUser);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (error) {
		next(error)
	}
};
exports.updatePassword = async (req, res, next) => {
	try {
		const { newPass, oldPass, idUser } = req.body;
		const response = await userService.updatePassword(newPass, oldPass, idUser);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (error) {
		next(error);
	}
}
