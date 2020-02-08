const httpStatus = require('http-status');

exports.me = (req, res, next) => {
	try
	{
		res.status(httpStatus.OK).json(req.jwtDecoded);
	}
	catch(e)
	{
		next(e);
	}
}
