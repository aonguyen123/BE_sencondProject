const socketio = require("socket.io");
const { port, env } = require("./constants");
const server = require("./config/express.config");
const { addUserChat, removeUserChat, getUser } = require('./utils/user');
const { createRoom, joinRoom, updateJoinRoom, unJoinRoom, disconnect, leaveRoom, deleteRoom } = require('./utils/room');
const { addMessage } = require('./utils/messages');
const { sendAddFriend, addFriend, addFriendCancel, cancelFriend } = require('./utils/events');

const io = socketio(server);

io.on('connection', socket => {
	socket.on('join', async ({_id}) => {
		const { userChat } = await addUserChat(_id, socket.id);
		socket.emit('welcome', {text: `Welcome ${userChat.idUser.displayName} to the chat application`});

		socket.broadcast.emit('notice', {text: `${userChat.idUser.displayName} joined chat application`});
	});

	socket.on('sendMessage', async ({message}) => {
		const user = await getUser(socket.id);
		const data = await addMessage(user.idUser._id, message, null);
		io.emit('message', data);
	});

	socket.on('createRoom', async ({roomName, upload, password}, _id) => {
		const { room } = await createRoom(roomName, upload, password, _id);
		socket.emit('welcome', {text: 'Create room success'});
		io.emit('createRoom', room);
	});
	socket.on('onJoin', async ({password, idRoom}, callback) => {
		const user = await getUser(socket.id);
		const { data, error } = await joinRoom(user.idUser._id, idRoom, password, socket.id);
		if(data) {
			socket.emit('onJoin', data);
		} else {
			callback(error);
		}
	});
	socket.on('joinRoom', async ({_id, idRoom}) => {
		const doc = await updateJoinRoom(_id, idRoom, socket.id);
		if(doc) {
			socket.join(idRoom);
			io.to(idRoom).emit('joinRoom', doc);
			socket.broadcast.to(idRoom).emit('notice', ({text: `${doc.idUser.displayName} joined ${doc.idRoom.roomName} room`}));
		}
	});

	socket.on('sendMessageRoom', async ({message, idRoom, idUser}) => {
		const data = await addMessage(idUser, message, idRoom);
		io.to(idRoom).emit('sendMessageRoom', data);
	});
	socket.on('deleteRoom', async ({idRoom}) => {
		const data = await deleteRoom(idRoom);
		io.emit('deleteRoom', data);
	});
	socket.on('leaveRoom', async ({idRoom, idUser}) => {
		const data = await leaveRoom(idRoom, idUser);
		socket.emit('leaveRoomSuccess');
		socket.broadcast.to(data.idRoom).emit('leaveRoom', data);
		socket.broadcast.to(data.idRoom).emit('notice', {text: `${data.idUser.displayName} leaved room`});
	});
	socket.on('unJoinRoom', async ({_id, idRoom}) => {
		const doc = await unJoinRoom(_id, idRoom, socket.id);
		if(doc) {
			socket.leave(idRoom);
			socket.broadcast.to(idRoom).emit('unJoinRoom', doc);
		}
	});
	//add event
	socket.on('subscribe', (idUser) => {
		socket.join(idUser);
		socket.broadcast.emit('subscribe', idUser);
	});

	socket.on('sendAddFriend', async ({idSender, idReceiver}, callback) => {
		const { newEvent, error } = await sendAddFriend(idSender, idReceiver);
		if(error !== null) {
			callback(error);
		} else {
			socket.to(idReceiver).emit('sendEvent', {newEvent});
			socket.emit('sendAddFriendSuccess', true);
		}
	});

	socket.on('addFriend', async ({idEvent}, callback) => {
		const { friendReceiver, friendSender, newEvent } = await addFriend(idEvent);
		socket.emit('addFriendSuccess', {friendReceiver, idEvent})
		socket.to(friendReceiver._id).emit('addFriend', {friendSender});
		socket.to(newEvent.idReceiver).emit('sendEvent', {newEvent});
		callback();
	});

	socket.on('addFriendCancel', async ({idEvent}, callback) => {
		const { newEvent } = await addFriendCancel(idEvent);
		socket.emit('addFriendCancel', {idEvent});
		socket.to(newEvent.idReceiver).emit('sendEvent', {newEvent});
		callback();
	});

	socket.on('cancelFriend', async ({idFriend, idUser}, callback) => {
		const { newEvent } = await cancelFriend(idFriend, idUser);
		socket.to(idFriend).emit('sendEvent', {newEvent});
		socket.to(idFriend).emit('unFriend', {idUser});
		callback(idFriend);
	});
	//
	socket.on('hasLeft', async () => {
		await removeUserChat(socket.id);
	})
	socket.on('disconnect', async () => {
		socket.leave();

		const doc = await disconnect(socket.id);

		if(doc) {
			socket.broadcast.to(doc.idRoom).emit('unJoinRoom', doc);
			socket.broadcast.emit('notice', ({text: `${doc.idUser.displayName} disconnect`}));
		}
		await removeUserChat(socket.id);
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
