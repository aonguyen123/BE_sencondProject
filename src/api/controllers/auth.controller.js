const authService = require("./../services/auth.service");

exports.register = async (req, res, next) => {
	try {
		const { values } = req.body;
		const response = await authService.register(values);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (e) {
		next(e);
	}
};
exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = { email, password };
		const response = await authService.login(user);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (e) {
		next(e);
	}
};
exports.refreshToken = async (req, res, next) => {
	try {
		const { refreshToken } = req.body;
		const response = await authService.refreshToken(refreshToken);
		const { code, ...rest } = response;
		return res.status(code).json(rest);
	} catch (e) {
		next(e);
	}
};

exports.authorize = async (req, res, next) => {
	try {
		const { accessToken } = req.body;
		const result = await authService.authorize(accessToken);
		const { code, ...rest } = result;
		return res.status(code).json(rest);
	} catch (error) {
		next(error);
	}
}
