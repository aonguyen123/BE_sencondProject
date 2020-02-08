module.exports = {
	notAuthenticated: () => {
		return {
			message: 'NOT_AUTHENTICATED'
		}
	},
	internal_server_error: () => {
		return {
			message: 'INTERNAL_SERVER_ERROR'
		}
	},
	refresh_token_expires: () => {
		return {
			message: 'REFRESH_TOKEN_EXPIRES'
		}
	},
	token_expires: () => {
		return {
			message: 'REFRESH_TOKEN_EXPIRES'
		}
	},
	token_empty: () => {
		return {
			message: 'TOKEN EMPTY'
		}
	},
	greetUser: payload => {
		return {
			message: 'GREET_USER',
			user: payload
		}
	}
}
