const mongoose = require('mongoose');
const httpStatus = require("http-status");
const responseService = require("./response.service");
const { postCollection } = require("./../repository");
const { asyncForEach } = require("./../helpers/loop.helper");

module.exports = {
	createPost: async (reqFiles, idUser, mentionsList, posts) => {
		try {
			const post = new postCollection({
				idUser,
				content: posts
			});
			const result = await post.save();
			if (!result) {
				return {
					code: httpStatus.BAD_REQUEST,
					message: "Create post error"
				};
			}
			if (mentionsList !== undefined) {
				let item = {};
				await asyncForEach(mentionsList, async mention => {
					item.idUser = mention;
					await postCollection.updateMany(
						{ _id: result._id },
						{ $push: { mentions: item } }
					);
					item = {};
				});
			}
			if (reqFiles.length > 0) {
				let item = {};
				await asyncForEach(reqFiles, async file => {
					item.url = file;
					await postCollection.updateMany(
						{ _id: result._id },
						{ $push: { images: item } }
					);
					item = {};
				});
			}
			const newPostResult = await postCollection
				.findById(result._id)
				.populate("idUser")
				.populate("mentions.idUser");
			return {
				code: httpStatus.OK,
				message: "Create post success",
				newPost: newPostResult
			};
		} catch (e) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: responseService.server_error().message
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
				.sort({ _id: "desc" })
				.populate("idUser")
				.populate("mentions.idUser");
			if (posts.length === 0) {
				return {
					code: httpStatus.BAD_REQUEST,
					message: "Infinite list loaded all"
				};
			}
			return {
				code: httpStatus.OK,
				posts
			};
		} catch (e) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: responseService.server_error().message
			};
		}
	},
	fetchPostById: async (id, page, page_size) => {
		try {
			id = mongoose.Types.ObjectId(id);
			page = parseInt(page);
			page_size = parseInt(page_size);

			const postsById = await postCollection
				.find({idUser: id})
				.skip(page * page_size - page_size)
				.limit(page_size)
				.sort({ _id: "desc" })
				.populate("mentions.idUser");
			if (postsById.length === 0) {
				return {
					code: httpStatus.BAD_REQUEST,
					message: "Infinite list loaded all"
				};
			}
			return {
				code: httpStatus.OK,
				postsById
			};
		} catch (e) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: responseService.server_error().message
			};
		}
	}
};
