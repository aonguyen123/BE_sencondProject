const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	_id: Schema.Types.ObjectId,
	email: String,
	password: String,
	birthday: Date,
	gender: Boolean
})
userSchema.set('timestamps', true);

const userCollection = mongoose.model('UserCollection', userSchema);
module.exports = userCollection;
