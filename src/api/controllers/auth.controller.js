const httpStatus = require("http-status");
const authService = require("./../services/auth.service");

exports.register = async (req, res, next) => {
	try {
		const { values } = req.body;
		const response = await authService.register(values);
		const { code, ...rest } = response;

		if (code === httpStatus.BAD_REQUEST) {
			return res.status(httpStatus.BAD_REQUEST).json(rest);
		} else if (code === httpStatus.INTERNAL_SERVER_ERROR) {
			return res
				.status(httpStatus.INTERNAL_SERVER_ERROR).json(rest);
		}
		return res.status(httpStatus.OK).json(rest);
	} catch (e) {
		next(e);
	}
};
exports.login = async (req, res, next) => {
	try {
		//const io = req.app.get('socketio');

		const { email, password } = req.body;
		const user = {
			email,
			password
		};
		const response = await authService.login(user);
		const { code, ...rest } = response;

		if (code === httpStatus.BAD_REQUEST) {
			return res.status(httpStatus.BAD_REQUEST).json(rest);
		} else if (code === httpStatus.INTERNAL_SERVER_ERROR) {
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(rest);
		}
		return res.status(httpStatus.OK).json(rest);
	} catch (e) {
		next(e);
	}
};
exports.refreshToken = async (req, res, next) => {
	try {
		const { refreshToken } = req.body;
		const response = await authService.refreshToken(refreshToken);
		const { code, ...rest } = response;
		if (code === httpStatus.UNAUTHORIZED) {
			return res
				.status(httpStatus.UNAUTHORIZED)
				.json('Unauthorized');
		}
		return res.status(httpStatus.OK).json(rest);
	} catch (e) {
		next(e);
	}
};

exports.authorize = async (req, res, next) => {
	try {
		const { accessToken } = req.body;
		const result = await authService.authorize(accessToken);
		const { code, ...rest } = result;
		if(code === httpStatus.OK)
		{
			return res.status(httpStatus.OK).json(rest);
		}
		if(code === httpStatus.UNAUTHORIZED)
		{
			return res.status(httpStatus.UNAUTHORIZED).json('Unauthorized');
		}
	} catch (error) {
		next(error);
	}
}
