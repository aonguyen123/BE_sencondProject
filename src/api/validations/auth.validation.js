const BaseJoi = require('joi');
const extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(extension);

module.exports = {
	register: {
		body: {
			email: Joi.string().email().required(),
			password: Joi.string().required(),
			birthday: Joi.date().format('DD/MM/YYYY').max('now').required(),
			gender: Joi.bool().required(),
		}
	},
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
