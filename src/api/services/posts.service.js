const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { postCollection } = require("./../repository");
const { asyncForEach } = require("./../helpers/loop.helper");

module.exports = {
	createPost: async (urlImages, idUser, mentions, posts) => {
		try {
			const post = new postCollection({
				idUser,
				content: posts,
			});
			const result = await post.save();
			if (!result) {
				return {
					code: httpStatus.BAD_REQUEST,
					message: "Create post error",
				};
			}
			if (mentions !== undefined) {
				let item = {};
				await asyncForEach(mentions, async (mention) => {
					item.idUser = mention;
					await postCollection.updateMany(
						{ _id: result._id },
						{ $push: { mentions: item } }
					);
					item = {};
				});
			}
			if (urlImages.length > 0) {
				let item = {};
				await asyncForEach(urlImages, async (url) => {
					item.url = url;
					await postCollection.updateMany(
						{ _id: result._id },
						{ $push: { images: item } }
					);
					item = {};
				});
			}
			return {
				code: httpStatus.OK,
				message: "Create post success"
			};
		} catch (e) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: "Create post fail. Server error, please again!!!",
			};
		}
	},
	fetchPost: async (page, page_size) => {
		try {
			page = parseInt(page);
			page_size = parseInt(page_size);

			const posts = await postCollection
				.find()
				.skip(page * page_size - page_size)
				.limit(page_size)
				.sort({ _id: -1 })
				.populate("idUser", 'displayName photoURL')
				.populate("mentions.idUser", 'displayName photoURL')
				.populate('likes.idUser', 'displayName photoURL')
				.populate('dislikes.idUser', 'displayName photoURL');

			if (posts.length < page_size) {
				return {
					code: httpStatus.OK,
					message: 'LOADED ALL',
					posts,
				};
			}
			return {
				code: httpStatus.OK,
				posts,
			};
		} catch (e) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: "Fetch post fail. Server error, please again!!!",
			};
		}
	},
	fetchPostById: async (id, page, page_size) => {
		try {
			id = mongoose.Types.ObjectId(id);
			page = parseInt(page);
			page_size = parseInt(page_size);

			const postsById = await postCollection
				.find({ idUser: id })
				.skip(page * page_size - page_size)
				.limit(page_size)
				.sort({ _id: "desc" })
				.populate("idUser", 'displayName photoURL')
				.populate("mentions.idUser", 'displayName photoURL')
				.populate('likes.idUser', 'displayName photoURL')
				.populate('dislikes.idUser', 'displayName photoURL');
			if (postsById.length < page_size) {
				return {
					code: httpStatus.OK,
					message: "LOADED ALL",
					postsById
				};
			}
			return {
				code: httpStatus.OK,
				postsById,
			};
		} catch (e) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: [
					'ID user wrong, please try id user other',
					'Server response timed out, please check network and try again',
				],
			};
		}
	},
	likePost: async (idUser, idPost) => {
		try {
			const checkDislike = await postCollection.findOne({_id: idPost, dislikes: {$elemMatch: {idUser}}});
			if(checkDislike === null) {
				const checkLike = await postCollection.findOne({
					_id: idPost,
					likes: { $elemMatch: { idUser } },
				}).populate('idUser', 'displayName photoURL').populate("mentions.idUser", 'displayName photoURL')
				.populate('likes.idUser', 'displayName photoURL')
				.populate('dislikes.idUser', 'displayName photoURL');
				if (checkLike === null) {
					await postCollection.findByIdAndUpdate(idPost, {
						$push: { likes: { idUser } },
					});
				} else {
					const index = checkLike.likes.findIndex(l => l.idUser._id === idUser);
					checkLike.likes.splice(index, 1);
					await checkLike.save();
					return {
						code: httpStatus.OK,
						post: checkLike,
						message: 'UNLIKE'
					};
				}
			} else {
				const index = checkDislike.dislikes.findIndex(dl => dl.idUser === idUser);
				checkDislike.dislikes.splice(index, 1);
				checkDislike.likes.push({idUser});
				await checkDislike.save();
			}

			const post = await postCollection
				.findById(idPost)
				.populate("idUser", "displayName photoURL")
				.populate("mentions.idUser", 'displayName photoURL')
				.populate('likes.idUser', 'displayName photoURL')
				.populate('dislikes.idUser', 'displayName photoURL');
			return {
				code: httpStatus.OK,
				post
			};
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: "Like fail. Server error, please again!!!",
			};
		}
	},
	dislikePost: async (idUser, idPost) => {
		try {
			const checkLike = await postCollection.findOne({_id: idPost, likes: {$elemMatch: {idUser}}});
			if(checkLike === null) {
				const checkDislike = await postCollection.findOne({
					_id: idPost,
					dislikes: { $elemMatch: { idUser } },
				}).populate('idUser', 'displayName photoURL').populate("mentions.idUser", 'displayName photoURL')
				.populate('likes.idUser', 'displayName photoURL')
				.populate('dislikes.idUser', 'displayName photoURL');;
				if (checkDislike === null) {
					await postCollection.findByIdAndUpdate(idPost, {
						$push: { dislikes: { idUser } },
					});
				} else {
					const index = checkDislike.dislikes.findIndex(dl => dl.idUser === idUser);
					checkDislike.dislikes.splice(index, 1);
					await checkDislike.save();
					return {
						code: httpStatus.OK,
						post: checkDislike,
						message: 'UNDISLIKE'
					};
				}
			} else {
				const index = checkLike.likes.findIndex(l => l.idUser === idUser);
				checkLike.likes.splice(index, 1);
				checkLike.dislikes.push({idUser});
				await checkLike.save();
			}

			const post = await postCollection
					.findById(idPost)
					.populate("idUser", "displayName photoURL")
					.populate("mentions.idUser", 'displayName photoURL')
					.populate('likes.idUser', 'displayName photoURL')
					.populate('dislikes.idUser', 'displayName photoURL');
			return {
				code: httpStatus.OK,
				post
			};
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: "Dislike fail. Server error, please again!!!",
			};
		}
	}
};
