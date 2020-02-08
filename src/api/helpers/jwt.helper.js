const jwt = require("jsonwebtoken");

const generateToken = (user, secretSignature, tokenLife) => {
	return new Promise((resolve, reject) => {
		const userData = {
			_id: user._id,
			email: user.email,
			gender: user.gender,
			birthday: user.birthday
		};
		jwt.sign(userData, secretSignature,
			{
				algorithm: "HS256",
				expiresIn: tokenLife
			}, (err, token) => {
				if (err) {
					return reject(err);
				}
				resolve(token);
			}
		);
	});
};
const verifyToken = (token, secretKey) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secretKey, (err, decoded) => {
			if (err) {
				return reject(err);
			}
			resolve(decoded);
		});
	});
};
module.exports = {
	generateToken,
	verifyToken
}
