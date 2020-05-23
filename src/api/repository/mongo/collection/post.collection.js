const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
	idUser: {
		type: Schema.Types.ObjectId,
		ref: "UserCollection",
	},
	content: {
		type: String,
		default: "",
	},
	images: {
		type: Array,
		url: {
			type: String,
		},
	},
	mentions: [
		{
			idUser: {
				type: Schema.Types.ObjectId,
				ref: "UserCollection",
			},
		},
	],
	likes: [
		{
			idUser: {
				type: Schema.Types.ObjectId,
				ref: "UserCollection",
			},
		},
	],
	dislikes: [
		{
			idUser: {
				type: Schema.Types.ObjectId,
				ref: "UserCollection",
			}
		}
	],
	comments: {
		type: Array,
		idUser: {
			type: Schema.Types.ObjectId,
			ref: "UserCollection",
		},
	},
});
postSchema.set("timestamps", true);
postSchema.index({ idUser: 1 }, { name: "query_for_post_by_idUser" });
postSchema.index({ "likes.idUser": 1 }, { name: "query_for_like" });
postSchema.index({ "dislikes.idUser": 1 }, { name: "query_for_dislike" });

const postCollection = mongoose.model("PostCollection", postSchema);

module.exports = postCollection;
