const { port, env } = require('./constants');
const app = require('./config/express.config');

app.listen(port, err => {
	if(err)
	{
		return console.log('server failed to start', err);
	}
	return console.log(`server start port ${port} in environment ${env}`);
})
module.exports = app;
