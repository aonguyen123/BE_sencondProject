const httpStatus = require("http-status");
const { userCollection } = require("./../repository");

module.exports = {
	searchUser: async q => {
		try {
			const data = await userCollection.find({
				searchUser: { $regex: ".*" + q + ".*" }
			});
			return {
				code: httpStatus.OK,
				data
			};
		} catch (e) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: 'Search user fail. Server error, please again!!!'
			};
		}
	},
	fetchUser: async idUser => {
		try {
			const userData = await userCollection.findById(idUser);
			return {
				code: httpStatus.OK,
				userData
			};
		} catch (e) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: 'Fetch user fail. Server error, please again!!!'
			};
		}
	}
};
