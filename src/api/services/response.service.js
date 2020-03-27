module.exports = {
	server_error: () => {
		return {
			message: 'Internal server error'
		}
	},
	bad_request: () => {
		return {
			message: 'BAD_REQUEST'
		}
	},
	not_authenticated: () => {
		return {
			message: 'NOT_AUTHENTICATED'
		}
	}
}
