const path = require('path');
require('dotenv-safe').config({
	example: path.join(__dirname, '../../.env.example'),
	path: path.join(__dirname, '../../.env')
});

const common = require('./constants.common');

const getEnvironmentConstants = env => {
	switch(env)
	{
		case 'development':
			return require('./constants.dev');
		case 'production':
			return require('./constants.prod');
		default:
			throw new Error(`no matching constants file found for env ${env}`);
	}
};
module.exports = Object.assign(common, getEnvironmentConstants(process.env.NODE_ENVIROMMENT));
