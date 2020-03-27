const httpStatus = require('http-status');
const authService = require('./../services/auth.service');
const responseService = require('./../services/response.service');

exports.register = async (req, res, next) => {
	try
	{
		const { values } = req.body;
		const response = await authService.register(values);
		const { code, ...rest } = response;

		if(code === httpStatus.BAD_REQUEST)
		{
			return res.status(httpStatus.BAD_REQUEST).json(rest);
		}
		else if(code === httpStatus.INTERNAL_SERVER_ERROR)
		{
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(rest);
		}
		return res.status(httpStatus.OK).json(rest);
	}
	catch(e)
	{
		next(e);
	}
}
exports.login = async (req, res, next) => {
	try
	{
		const { email, password } = req.body;
		const user = {
			email, password
		}
		const response = await authService.login(user);
		const { code, ...rest } = response;

		if(code === httpStatus.BAD_REQUEST)
		{
			return res.status(httpStatus.BAD_REQUEST).json(rest);
		}
		else if(code === httpStatus.INTERNAL_SERVER_ERROR)
		{
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(rest);
		}
		return res.status(httpStatus.OK).json(rest);
	}
	catch(e)
	{
		next(e);
	}
}
exports.refreshToken = async (req, res, next) => {
	try{
		const { refreshToken } = req.body;
		const response = await authService.refreshToken(refreshToken);
		const { code, ...rest } = response;
		if(code === httpStatus.UNAUTHORIZED)
		{
			return res.status(httpStatus.UNAUTHORIZED).json(responseService.not_authenticated().message);
		}
		return res.status(httpStatus.OK).json(rest);
	}
	catch(e)
	{
		next(e);
	}
}
