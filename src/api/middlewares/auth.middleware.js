const httpStatus = require('http-status');
const { verifyToken } = require('./../helpers/jwt.helper');

module.exports = async (req, res, next) => {
	const secretToken = process.env.JWT_SECRET || 'access-token-secret-aonguyen'
	const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
	if(tokenFromClient)
	{
		try {
			const decoded = await verifyToken(tokenFromClient, secretToken);
			req.jwtDecoded = decoded;
			next();
		}
		catch(e)
		{
			return res.status(httpStatus.UNAUTHORIZED).json('UNAUTHORIZE');
		}
	}
	else
	{
		return res.status(httpStatus.UNAUTHORIZED).json(responseService.not_authenticated().message);
	}
}
