const { userCollection } = require('./../api/repository/index');

const users = [];

function addUser({id, username, room, _id, photoURL, time}) {
	const index = users.findIndex(user => user._id === _id && user.status === 'offline');
	if(index !== -1) {
		users.splice(index, 1);
	}

	const user = { id, username, room, _id, photoURL, time, status: 'online' }

	users.push(user);

	return { user };
}
function updateUserOffline(id) {
	const index = users.findIndex(user => user.id === id);
	if(index !== -1) {
		users[index].status = 'offline';
		users[index].time = Date.now();
		return users[index];
	}
}
function getUser(id) {
	return users.find(user => user.id === id);
}
function getUserInRoom(room) {
	return users.filter(user => user.room === room);
}

module.exports = {
	addUser,
	updateUserOffline,
	getUser,
	getUserInRoom
}
