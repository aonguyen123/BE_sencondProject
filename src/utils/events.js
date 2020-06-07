const { eventCollection, userCollection } = require("./../api/repository");

async function sendAddFriend(idSender, idReceiver) {
	let newEvent, error = null;
	const check = await eventCollection.findOne({idReceiver: idSender, idSender: idReceiver, status: 0, type: 'ADD_FRIEND'});
	console.log(check);

	if(check === null) {
		const doc = new eventCollection({
			idSender,
			idReceiver,
			type: "ADD_FRIEND",
			description: 'SEND_ADD_FRIEND'
		});
		const result = await doc.save();
		newEvent = await eventCollection
			.findById(result._id)
			.populate("idSender", "displayName photoURL");
	} else {
		error = 'The request is awaiting confirmation';
	}
	return {newEvent, error};
}

async function addFriend(idEvent) {
	const event = await eventCollection.findByIdAndUpdate(idEvent, {status: 1});
	await userCollection.findByIdAndUpdate(event.idReceiver, {$push: {friends: {idUser: event.idSender}}});
	await userCollection.findByIdAndUpdate(event.idSender, {$push: {friends: {idUser: event.idReceiver}}});

	const doc = new eventCollection({
		idSender: event.idReceiver,
		idReceiver: event.idSender,
		type: 'NOTIFICATION',
		description: 'ADD_FRIEND_OK'
	});
	const saveEvent = await doc.save();
	const newEvent = await eventCollection.findById(saveEvent._id).populate("idSender", "displayName photoURL");

	const friendReceiver = await userCollection.findById(event.idSender, 'displayName photoURL');
	const friendSender = await userCollection.findById(event.idReceiver, 'displayName photoURL');

	return {
		friendReceiver,
		friendSender,
		newEvent
	}
}

async function addFriendCancel(idEvent) {
	const event = await eventCollection.findByIdAndUpdate(idEvent, {status: 1});

	const doc = new eventCollection({
		idSender: event.idReceiver,
		idReceiver: event.idSender,
		type: 'NOTIFICATION',
		description: 'ADD_FRIEND_REFUSE'
	});
	const saveEvent = await doc.save();
	const newEvent = await eventCollection.findById(saveEvent._id).populate("idSender", "displayName photoURL");
	return {
		newEvent
	}
}

module.exports = {
	sendAddFriend,
	addFriend,
	addFriendCancel
}
