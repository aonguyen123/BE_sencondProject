const jwt = require("jsonwebtoken");

const generateToken = (user, secretSignature, tokenLife) => {
	return new Promise((resolve, reject) => {
		jwt.sign(user, secretSignature,
			{
				algorithm: "HS256",
				expiresIn: tokenLife
			}, (err, token) => {
				if (err) {
					console.log('loiooooo')
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
