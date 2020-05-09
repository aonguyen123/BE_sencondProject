const mongoose = require('mongoose');
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
	},
	fetchUserById: async idUser => {
		try {
			idUser = mongoose.Types.ObjectId(idUser);
			const user = await userCollection.findById(idUser);
			if(user) {
				return {
					code: httpStatus.OK,
					user
				}
			}
			return {
				code: httpStatus.BAD_REQUEST,
				message: 'User not found'
			}
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: 'Fetch user fail. Server error, please again!!!'
			};
		}
	},
	updatePhotoURL: async (photoURL, idUser) => {
		try {
			await userCollection.findByIdAndUpdate(idUser, {photoURL});
			return {
				code: httpStatus.OK,
				photoURL
			}
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: 'Update photo fail. Server error, please again!!!'
			};
		}
	}
};
