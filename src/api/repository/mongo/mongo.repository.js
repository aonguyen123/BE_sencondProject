const mongoose = require('mongoose');
const { databaseURL } = require('./../../../constants');
const userCollection = require('./collection/user.collection');
const postCollection = require('./collection/post.collection');
const chatCollection = require('./collection/chat.collection');
const roomCollection = require('./collection/room.collection');
const userChatCollection = require('./collection/userChat.collection');
const statusChatCollection = require('./collection/statusChat.collection');
const joinChatCollection = require('./collection/joinChat.collection');

const connectDB = () => {
	mongoose.connect(databaseURL, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
		useCreateIndex: true
	}).then(() => {
		console.log('database connected');
	}, err => {
		console.log('can not connect to mongodb' + err);
	});
}

module.exports = {
	userCollection,
	postCollection,
	chatCollection,
	roomCollection,
	userChatCollection,
	statusChatCollection,
	joinChatCollection,
	connectDB
}
