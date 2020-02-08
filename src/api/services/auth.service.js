const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { userCollection } = require("./../repository");
const { hashPassword, comparePassword } = require("../helpers/password.helper");
const { generateToken, verifyToken } = require("./../helpers/jwt.helper");

const accessTokenLife = process.env.JWT_EXPIRES_IN;
const accessTokenSecret = process.env.JWT_SECRET;
const refreshTokenLife = process.env.JWT_REFRESH_EXPIRES_IN;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

module.exports = {
	register: async user => {
		const checkUser = await userCollection.findOne({ email: user.email });
		if (checkUser) {
			return {
				message: "email has exist",
				code: httpStatus.BAD_REQUEST
			};
		}
		const newUser = new userCollection({
			_id: new mongoose.Types.ObjectId(),
			email: user.email,
			password: await hashPassword(user.password),
			birthday: user.birthday,
			gender: user.gender
		});
		const result = await newUser.save();
		return {
			code: httpStatus.OK,
			message: "register success",
			newUser: result
		};
	},
	login: async user => {// truong hop k co internet thi giong nhu catch trong login
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
			const comparePass = await comparePassword(
				checkUser.password,
				user.password
			);
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
				refreshToken
			};
		}
		catch(e)
		{
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR
			}
		}
	},
	refreshToken: async refreshToken => {
		try {
			const decoded = await verifyToken(refreshToken, refreshTokenSecret);
			const accessToken = await generateToken(decoded, accessTokenSecret, accessTokenLife);
			return {
				code: httpStatus.OK,
				accessToken,
				refreshToken
			}
		} catch (e) {
			return {
				code: httpStatus.UNAUTHORIZED
			}
		}
	}
};
