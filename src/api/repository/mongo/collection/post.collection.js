const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
	idUser: {
		type: Schema.Types.ObjectId,
		ref: 'UserCollection'
	},
	content: {
		type: String,
		default: ''
	},
	images: [
		{
			url: {
				type: String
			}
		}
	],
	mentions: [
		{
			idUser: {
				type: Schema.Types.ObjectId,
				ref: 'UserCollection',
			}
		}
	]
});

postSchema.set('timestamps', true);
postSchema.index({content: 'text'});

const postCollection = mongoose.model('PostCollection', postSchema);
module.exports = postCollection;
