module.exports = {
	env: process.env.NODE_ENVIROMMENT,
	port: process.env.PORT,
	databaseURL: `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@ds261114.mlab.com:61114/login-auth`
};
