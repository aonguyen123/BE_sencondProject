const path = require('path');
const ExpressSession = require('express-session');
const FileStore = require('session-file-store')(ExpressSession);
const option = {
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1 * 24 * 60 * 1000
	},
	name: 'api-structure',
	//save redis or mongodb
	store: new FileStore({
		path: path.join(__dirname, '../../session'),
		secret: process.env.SESSION_SECRET,
		retries: 1,
		fileExtension: '',
	}),
}
module.exports = () => ExpressSession(option);
