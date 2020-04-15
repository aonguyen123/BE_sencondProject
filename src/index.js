const socketio = require("socket.io");
const { port, env } = require("./constants");
const server = require("./config/express.config");
const { addUser, updateUserOffline, getUser, getUserInRoom } = require('./utils/user');

const io = socketio(server);

io.on('connection', socket => {
	socket.on('join', ({_id, displayName, photoURL, time, room}) => {
		const { user } = addUser({id: socket.id, username: displayName, room, _id, photoURL, time});
		socket.emit('message', {user: 'Admin', text: `Welcome ${user.username} to the chat application`, time: user.time});
		socket.broadcast.to(user.room).emit('message', {user: 'Admin', text: `${user.username} has joined`, time: user.time});

		socket.join(user.room);
		io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)});
	});

	socket.on('sendMessage', data => {
		const user = getUser(socket.id);
		io.to(user.room).emit('message', {user: user.username, text: data.message, _id: user._id, photoURL: user.photoURL, time: data.time});
		io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)});
	});

	socket.on('disconnect', () => {
		// io.to(user.room).emit('message', {user: 'Admin', text: `${user.username} has left`});
		// io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)});
		const user = updateUserOffline(socket.id);
		if(user) {
			io.to(user.room).emit('message', {user: 'Admin', text: `${user.username} has left`});
			io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)});
		}
	});
});

//app.set('socketio', io);


server.listen(port, (err) => {
	if (err) {
		return console.log("server failed to start", err);
	}
	return console.log(`server start port ${port} in environment ${env}`);
})
module.exports = server;
