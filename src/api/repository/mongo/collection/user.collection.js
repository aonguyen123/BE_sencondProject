const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	_id: Schema.Types.ObjectId,
	email: String,
	password: String,
	displayName: String,
	searchUser: String,
	photoURL: String,
	gender: {
		type: String,
		default: ''
	},
	birthday: {
		type: String,
		default: ''
	},
	provinceOrCity: {
		type: Object,
		default: ''
	},
	district: {
		type: Object,
		default: ''
	},
	phonenumber: {
		type: String,
		default: ''
	},
	description: {
		type: String,
		default: ''
	}
})
userSchema.set('timestamps', true);
userSchema.index({searchUser: -1}, {name: 'search_user'});

const userCollection = mongoose.model('UserCollection', userSchema);
module.exports = userCollection;
