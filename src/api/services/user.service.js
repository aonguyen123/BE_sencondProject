const httpStatus = require("http-status");
const { userCollection, eventCollection, settingCollection } = require("./../repository");
const { comparePassword, hashPassword } = require('./../helpers/password.helper');
const convertVie = require('./../utils/convertVie');

module.exports = {
	searchMentions: async q => {
		try {
			q = q.toLowerCase();
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
			const userData = await userCollection.findById(idUser).populate('friends.idUser', 'displayName photoURL');
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
	fetchUserById: async (idUser, idCur) => {
		try {
			const user = await userCollection.findById(idUser).populate('friends.idUser', 'displayName photoURL');
			if(!user) {
				return {
					code: httpStatus.BAD_REQUEST,
					message: ['ID user wrong, please try id user other',]
				}
			}
			const checkAddFriend = await eventCollection.findOne({idSender: idCur, idReceiver: idUser, type: 'ADD_FRIEND', status: 0});
			const checkSetting = await settingCollection.findOne({idUser});
			if(checkSetting && !checkSetting.settingPhone) {
				user.phonenumber = user.phonenumber.substr(0, 2) + '****' + user.phonenumber.substr(6);
			}
			return {
				code: httpStatus.OK,
				user,
				statusAddFriend: checkAddFriend ? true : false
			}
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: [
					'ID user wrong, please try id user other',
					'Server response timed out, please check network and try again',
				]
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
			const { value: valProvince, ...province } = data.address.province;
			const { value: valDistrict, ...district } = data.address.district;

			const checkEmail = await userCollection.find({_id: {$ne: idUser}}).findOne({email: data.email});
			if(checkEmail) {
				return {
					code: httpStatus.BAD_REQUEST,
					message: 'Email exist'
				}
			}

			const searchUser = convertVie(data.nickname);
			const checkSearchUser = await userCollection.findOne({_id: {$ne: idUser}}).findOne({searchUser});
			if(checkSearchUser) {
				return {
					code: httpStatus.BAD_REQUEST,
					message: 'Nick name existed'
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
	},
	updateInterest: async (interest, idUser) => {
		try {
			await userCollection.findByIdAndUpdate(idUser, {$push: {interests: {label: interest}}});
			return {
				code: httpStatus.OK,
				interest: {label: interest}
			}
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: 'Create interest fail. Server error, please again!!!'
			};
		}
	},
	removeInterest: async (interest, idUser) => {
		try {
			await userCollection.findByIdAndUpdate(idUser, {$pull: {interests: {label: interest}}});
			return {
				code: httpStatus.OK,
				interest: {label: interest}
			}
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: 'Remove interest fail. Server error, please again!!!'
			};
		}
	},
	searchUser: async (q, idUser) => {
		try {
			q = q.toLowerCase();
			const users = await userCollection.find({
				_id: {$ne: idUser}, searchUser: { $regex: ".*" + q + ".*" }
			}, 'displayName photoURL');
			return {
				code: httpStatus.OK,
				users
			};
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: 'Search user fail. Server error, please again!!!'
			};
		}
	},
	settingPhone: async (idUser, settingPhone) => {
		try {
			const check = await settingCollection.findOne({idUser});
			if(!check) {
				const doc = new settingCollection({
					idUser,
					settingPhone
				});
				await doc.save();
			} else {
				await settingCollection.updateOne({idUser}, {settingPhone});
			}
			return {
				code: httpStatus.OK,
			}
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: 'Setting phone number fail. Server error, please again!!!'
			};
		}
	}
};
