const httpStatus = require('http-status');
const authService = require('./../services/auth.service');
const responseAuthService = require('./../services/responseAuth.service');

exports.register = async (req, res, next) => {
	try
	{
		const { email, password, birthday, gender } = req.body;
		const user = {
			email, password, birthday, gender
		}
		const response = await authService.register(user);
		if(response.code === httpStatus.BAD_REQUEST)
		{
			return res.status(httpStatus.BAD_REQUEST).json(response);
		}
		return res.status(httpStatus.OK).json(response);
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
			return res.status(httpStatus.BAD_REQUEST).json(response);
		}
		else if(code === httpStatus.INTERNAL_SERVER_ERROR)
		{
			return res.status(httpStatus.INTERNAL_SERVER_ERROR).json(responseAuthService.internal_server_error());
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
		if(!refreshToken)
		{
			return res.status(httpStatus[403]).json(responseAuthService.notAuthenticated());
		}
		const response = await authService.refreshToken(refreshToken);
		const { code, ...rest } = response;
		if(code === httpStatus.UNAUTHORIZED)
		{
			return res.status(httpStatus.UNAUTHORIZED).json(responseAuthService.refresh_token_expires());
		}
		return res.status(httpStatus.OK).json(rest);
	}
	catch(e)
	{
		next(e);
	}
}
