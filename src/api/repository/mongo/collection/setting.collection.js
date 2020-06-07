const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const settingSchema = new Schema({
	idUser: {
		type: Schema.Types.ObjectId,
		ref: 'UserCollection'
	},
	settingPhone: Boolean
});

settingSchema.set('timestamps', true);

const settingCollection = mongoose.model('SettingCollection', settingSchema);
module.exports = settingCollection;
