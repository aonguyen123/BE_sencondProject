const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	_id: Schema.Types.ObjectId,
	email: String,
	password: String,
	nickname: String,
	gender: String,
	birthday: String,
	provinceOrCity: String,
	district: String,
	phonenumber: String,
	description: {
		type: String,
		default: ''
	},
	avatar: {
		type: String,
		default: ''
	}
})
userSchema.set('timestamps', true);
userSchema.index({nickname: 'text'});

const userCollection = mongoose.model('UserCollection', userSchema);
module.exports = userCollection;
