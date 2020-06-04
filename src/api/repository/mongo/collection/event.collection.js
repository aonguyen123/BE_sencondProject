const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
	idSender: {
		type: Schema.Types.ObjectId,
		ref: 'UserCollection'
	},
	idReceiver: {
		type: Schema.Types.ObjectId,
		ref: 'UserCollection'
	},
	description: String,
	type: String,
	status: {
		type: Number,
		default: 0   	//0: chua xem, 1: da xem,
	}
});

eventSchema.set('timestamps', true);
eventSchema.index({idSender: 1}, {name: 'query_sender'});
eventSchema.index({idReceiver: 1}, {name: 'query_receiver'});

const eventCollection = mongoose.model('EventCollection', eventSchema);

module.exports = eventCollection;
