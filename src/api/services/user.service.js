const mongoose = require('mongoose');
const httpStatus = require("http-status");
const { userCollection } = require("./../repository");
const { comparePassword, hashPassword } = require('./../helpers/password.helper');

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
	},
	updateProfile: async (data, idUser) => {
		try {
			const searchUser = data.nickname.replace(/\s+/g, '');
			const { value: valProvince, ...province } = data.address.province;
			const { value: valDistrict, ...district } = data.address.district;

			const checkEmail = await userCollection.find({_id: {$ne: idUser}}).findOne({email: data.email});
			if(checkEmail) {
				return {
					code: httpStatus.BAD_REQUEST,
					message: 'Email exist'
				}
			}
			await userCollection.updateOne({_id: idUser} ,{$set: {
				email: data.email,
				displayName: data.nickname,
				searchUser,
				phonenumber: data.phone,
				description: data.profile,
				provinceOrCity: province,
				district: district
			}});
			return {
				code: httpStatus.OK,
				message: 'Update profile success'
			}
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: 'Update profile fail. Server error, please again!!!'
			};
		}
	},
	updatePassword: async (newPass, oldPass, idUser) => {
		try {
			const checkUser = await userCollection.findById(idUser);
			const matchPass = await comparePassword(checkUser.password, oldPass);
			if(!matchPass) {
				return {
					code: httpStatus.BAD_REQUEST,
					message: 'Password wrong'
				}
			}
			const hashPass = await hashPassword(newPass);
			await userCollection.findByIdAndUpdate(idUser, {password: hashPass});
			return {
				code: httpStatus.OK,
				message: 'Update password success'
			}
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: 'Update password fail. Server error, please again!!!'
			};
		}
	}
};
