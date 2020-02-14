const httpStatus = require('http-status');
module.exports = {
	server_error: () => {
		return {
			message: 'INTERNAL_SERVER_ERROR'
		}
	},
	bad_request: () => {
		return {
			message: 'BAD_REQUEST'
		}
	}
}
