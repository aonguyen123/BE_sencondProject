const socketio = require("socket.io");
const { port, env } = require("./constants");
const server = require("./config/express.config");
const { addUserChat, removeUserChat, getUser } = require('./utils/user');
const { createRoom, joinRoom, updateJoinRoom, unJoinRoom, disconnect } = require('./utils/room');
const { addMessage } = require('./utils/messages');

const io = socketio(server);

io.on('connection', socket => {
	socket.on('join', async ({_id}) => {
		const { data } = await addUserChat(_id, socket.id);
		socket.emit('welcome', {text: `Welcome ${data.displayName} to the chat application`});

		socket.broadcast.emit('notice', {displayName: data.displayName, text: data.text, createdAt: data.createdAt});
	});

	socket.on('sendMessage', async ({message}) => {
		const user = await getUser(socket.id);
		const data = await addMessage(user.idUser, message, null);

		io.emit('message', data);
		//io.to(user.room).emit('roomData', {room: user.room, users: getUserInRoom(user.room)});
	});

	socket.on('createRoom', async ({roomName, upload, password}, _id) => {
		const { status, room } = await createRoom(roomName, upload, password, _id);
		io.emit('notice', {displayName: status.displayName, text: status.text, createdAt: status.createdAt, target: status.target});
		io.emit('createRoom', room);
	});
	socket.on('onJoin', async ({password, idRoom}, callback) => {
		const user = await getUser(socket.id);
		const { data, error } = await joinRoom(user.idUser, idRoom, password, socket.id);
		if(data) {
			socket.emit('onJoin', data);
		} else {
			callback(error);
		}
	});
	socket.on('joinRoom', async ({_id, idRoom}) => {
		const doc = await updateJoinRoom(_id, idRoom, socket.id);

		socket.join(idRoom);
		io.to(idRoom).emit('joinRoom', doc);
	});

	socket.on('sendMessageRoom', async ({message, idRoom, idUser}) => {
		const data = await addMessage(idUser, message, idRoom);
		io.to(idRoom).emit('sendMessageRoom', data);
	});

	socket.on('unJoinRoom', async ({_id, idRoom}) => {
		const doc = await unJoinRoom(_id, idRoom, socket.id);
		socket.leave(idRoom);
		socket.broadcast.to(idRoom).emit('unJoinRoom', doc);
	});
	socket.on('hasLeft', async () => {
		const data = await removeUserChat(socket.id);
		if(data) {
			socket.broadcast.emit('notice', {displayName: data.displayName, text: data.text, createdAt: data.createdAt});
		}
	})
	socket.on('disconnect', async () => {
		const doc = await disconnect(socket.id);
		if(doc) {
			socket.broadcast.to(doc.idRoom).emit('unJoinRoom', doc);
		}

		const data = await removeUserChat(socket.id);
		if(data) {
			socket.broadcast.emit('notice', {displayName: data.displayName, text: data.text, createdAt: data.createdAt});
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
