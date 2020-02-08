const Joi = require("joi");

module.exports = {
	// POST /v1/user/greet-me?name=<some_name>
	me: {
		query: {
			name: Joi.string().required(),
		},
		// body: {
		//     name: Joi.string().required(),
		// },
		// param: {
		//     name: Joi.string().required(),
		// },
	}
};
