const mongoose = require('mongoose');
const { databaseURL } = require('./../../../constants');
const userCollection = require('./collection/user.collection');

const connectDB = () => {
	mongoose.connect(databaseURL, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	}).then(() => {
		console.log('database connected');
	}, err => {
		console.log('can not connect to mongodb' + err);
	});
}

module.exports = {
	userCollection,
	connectDB
}
