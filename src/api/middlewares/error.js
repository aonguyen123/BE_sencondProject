const httpStatus = require('http-status');
const { ValidationError } = require('express-validation');

const { env } = require('./../../constants');
const APIError = require('./../utils/APIError');

const handler = (err, req, res, next) => {
	const response = {
		code: err.status || httpStatus.INTERNAL_SERVER_ERROR,
		message: err.message || httpStatus[err.status],
		errors: err.errors,
		stack: err.stack,
		timestamp: new Date().toISOString(),
		IP: req.ip,
		URL: req.originalUrl
	};
	if(env !== 'development')
	{
		delete response.stack;
	}
	res.status(response.code);
	res.json(response);
	res.end();
};
exports.handler = handler;

exports.converter = (err, req, res, next) => {
	let converterError = err;
	if(err instanceof ValidationError)
	{
		converterError = new APIError({
			message: 'Validation Error',
			errors: err.errors,
			status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
			stack: err.stack
		});
	}
	else if(!(err instanceof APIError))
	{
		converterError = new APIError({
			message: err.message,
			status: err.status || httpStatus.INTERNAL_SERVER_ERROR,
			stack: err.stack
		});
	}
	return handler(converterError, req, res);
}

//catch 404 and forward to error handler
exports.notFound = (req, res) => {
	const err = new APIError({
		message: 'Not found',
		status: httpStatus.NOT_FOUND
	});
	return handler(err, req, res);
}
