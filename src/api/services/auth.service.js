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
	register: async values => {
		try {
			const { email, password, nickname, upload } = values;

			const checkUser = await userCollection.findOne({email});
			if (checkUser) {
				return {
					code: httpStatus.BAD_REQUEST,
					message: "Email existed"
				};
			}
			const searchUser = nickname.replace(/\s+/g, '');
			const newUser = new userCollection({
				_id: new mongoose.Types.ObjectId(),
				email,
				password: await hashPassword(password),
				displayName: nickname.trim(),
				photoURL: upload,
				searchUser
			});
			const result = await newUser.save();
			if(result)
			{
				return {
					code: httpStatus.OK,
					message: "Register success"
				};
			}
			return {
				code: httpStatus.BAD_REQUEST,
				message: 'Register fail, please again'
			}
		} catch (e) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: 'Login fail, server error. Try again !!!'
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
				displayName: checkUser.displayName,
				photoURL: checkUser.photoURL,
				birthday: checkUser.birthday,
				description: checkUser.description,
				district: checkUser.district,
				gender: checkUser.gender,
				phonenumber: checkUser.phonenumber,
				provinceOrCity: checkUser.provinceOrCity
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
				user: checkUser,
				message: 'Login success'
			};
		} catch (e) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: 'Login fail, server error. Try again !!!'
			};
		}
	},
	refreshToken: async refreshToken => {
		try {
			const decoded = await verifyToken(refreshToken, refreshTokenSecret);
			const { iat, exp, ...rest } = decoded;
			const accessToken = await generateToken(
				rest,
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
	},
	authorize: async (accessToken) => {
		try {
			const secretToken = process.env.JWT_SECRET || 'access-token-secret-aonguyen';
			const decoded = await verifyToken(accessToken, secretToken);
			return {
				code: httpStatus.OK,
				payload: decoded
			}
		} catch (error) {
			return {
				code: httpStatus.UNAUTHORIZED
			}
		}
	}
};
