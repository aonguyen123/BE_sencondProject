const httpStatus = require('http-status');
const { commentCollection, postCollection } = require('./../repository');

module.exports = {
	addComment: async (idPost, idUser, content) => {
		try {
			const newComment = new commentCollection({
				idPost, idUser, content
			});
			const result = await newComment.save();
			await postCollection.findByIdAndUpdate(idPost, {$push: {comments: {idUser}}});

			const comment = await commentCollection.findById(result._id).populate('idUser', 'displayName photoURL');
			return {
				code: httpStatus.OK,
				comment
			}
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: 'Add comment fail, try again !'
			}
		}
	},
	fetchCommentByIdPost: async idPost => {
		try {
			const comments = await commentCollection.find({idPost}).populate('idUser', 'displayName photoURL').sort({_id: 1});
			const post = await postCollection.findById(idPost).populate('idUser', 'displayName photoURL').populate("mentions.idUser");
			return {
				code: httpStatus.OK,
				comments,
				post
			}
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: 'Fetch comment fail, try again !'
			}
		}
	}
}
