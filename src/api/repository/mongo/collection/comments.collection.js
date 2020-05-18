const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
	idPost: {
		type: Schema.Types.ObjectId,
		ref: 'PostCollection'
	},
	idUser: {
		type: Schema.Types.ObjectId,
		ref: 'UserCollection'
	},
	content: String
});

commentSchema.set('timestamps', true);
commentSchema.index({idPost: 1}, {name: 'query_comment_by_idPost'});

const commentCollection = mongoose.model('CommentCollection', commentSchema);
module.exports = commentCollection;
