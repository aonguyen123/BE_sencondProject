const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { userCollection } = require("./../repository");
const { hashPassword, comparePassword } = require("../helpers/password.helper");
const { generateToken, verifyToken } = require("./../helpers/jwt.helper");
const responseService = require('./response.service');

const accessTokenLife = process.env.JWT_EXPIRES_IN;
const accessTokenSecret = process.env.JWT_SECRET;
const refreshTokenLife = process.env.JWT_REFRESH_EXPIRES_IN;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

module.exports = {
	register: async values => {
		try {
			const { residence, confirm, ...rest } = values;
			rest.provinceOrCity = residence.provinceOrCity;
			rest.district = residence.district;

			const checkUser = await userCollection.findOne({
				email: rest.email
			});
			if (checkUser) {
				return {
					message: "Email existed",
					code: httpStatus.BAD_REQUEST
				};
			}
			const newUser = new userCollection({
				_id: new mongoose.Types.ObjectId(),
				email: rest.email,
				password: await hashPassword(rest.password),
				nickname: rest.nickname,
				gender: rest.gender,
				phonenumber: rest.phonenumber,
				birthday: rest.birthday,
				provinceOrCity: rest.provinceOrCity,
				district: rest.district
			});
			const result = await newUser.save();
			if(result)
			{
				return {
					code: httpStatus.OK,
					message: "Register success"
				};
			}
		} catch (e) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: responseService.server_error().message
			};
		}
	},
	login: async user => {
		try {
			const checkUser = await userCollection.findOne({
				email: user.email
			});
			if (!checkUser) {
				return {
					message: "User not found",
					code: httpStatus.BAD_REQUEST
				};
			}
			const comparePass = await comparePassword(checkUser.password, user.password);

			if (!comparePass) {
				return {
					message: "Password wrong",
					code: httpStatus.BAD_REQUEST
				};
			}
			const userData = {
				_id: checkUser._id,
				email: checkUser.email,
				gender: checkUser.gender,
				birthday: checkUser.birthday
			};
			const accessToken = await generateToken(
				userData,
				accessTokenSecret,
				accessTokenLife
			);
			const refreshToken = await generateToken(
				userData,
				refreshTokenSecret,
				refreshTokenLife
			);
			return {
				code: httpStatus.OK,
				accessToken,
				refreshToken,
				_id: checkUser._id,
				message: 'Login success'
			};
		} catch (e) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: responseService.server_error().message
			};
		}
	},
	refreshToken: async refreshToken => {
		try {
			const decoded = await verifyToken(refreshToken, refreshTokenSecret);
			const accessToken = await generateToken(
				decoded,
				accessTokenSecret,
				accessTokenLife
			);
			return {
				code: httpStatus.OK,
				accessToken
			};
		} catch (e) {
			return {
				code: httpStatus.UNAUTHORIZED
			};
		}
	}
};
