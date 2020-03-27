const BaseJoi = require('joi');
const extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(extension);

module.exports = {
	login: {
		body: {
			email: Joi.string().email().required(),
			password: Joi.string().required()
		}
	},
	refreshToken: {
		body: {
			refreshToken: Joi.string().required()
		}
	}
}
