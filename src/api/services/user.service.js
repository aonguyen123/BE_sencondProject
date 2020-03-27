const httpStatus = require('http-status');
const { userCollection } = require("./../repository");
const responseService = require('./response.service');

module.exports = {
	searchUser: async q => {
		const data = await userCollection.find({nickname: {$regex: '.*' + q + '.*' }});
		// const data = await userCollection.find({$text: {$search: q}});
		return {
			data
		}
	},
	fetchUser: async idUser => {
		try
		{
			const userData = await userCollection.findById(idUser);
			return {
				code: httpStatus.OK,
				userData
			};
		}
		catch(e)
		{
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: responseService.server_error().message
			}
		}
	}
}
