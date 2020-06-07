const httpStatus = require("http-status");
const { eventCollection } = require("./../repository");

module.exports = {
	fetchEvents: async (idUser) => {
		try {
			const events = await eventCollection
				.find({ idReceiver: idUser, status: 0 })
				.sort({_id: -1})
				.populate("idSender", "displayName photoURL");
			return {
				code: httpStatus.OK,
				events,
			};
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: "Fetch events fail. Server error, please again!!!",
			};
		}
	},
	removeEvent: async idEvent => {
		try {
			await eventCollection.findByIdAndUpdate(idEvent, {status: 1});
			return {
				code: httpStatus.OK,
			}
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: "Remove events fail. Server error, please again!!!",
			};
		}
	},
	removeAllEvents: async (eventType, idCur) => {
		try {
			if(eventType === 'Kết bạn' || eventType === 'Add friends') {
				eventType = 'ADD_FRIEND';
			}
			else if(eventType === 'Thông báo' || eventType === 'Notifications') {
				eventType = 'NOTIFICATION';
			}
			console.log(eventType, idCur)

			await eventCollection.updateMany({type: eventType, idReceiver: idCur}, {status: 1});
			return {
				code: httpStatus.OK,
				eventType
			}
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: "Remove all events fail. Server error, please again!!!",
			};
		}
	},
	fetchHistorys: async (idUser, page, page_size) => {
		try {
			page = parseInt(page);
			page_size = parseInt(page_size);

			const historys = await eventCollection.find({idSender: idUser})
									.skip(page * page_size - page_size)
									.limit(page_size)
									.sort({_id: -1})
									.populate('idReceiver', 'displayName').populate('idSender', 'displayName');

			return {
				code: httpStatus.OK,
				historys,
				message: historys.length < page_size && 'LOADED ALL',
			}
		} catch (error) {
			return {
				code: httpStatus.INTERNAL_SERVER_ERROR,
				message: "Fetch historys fail. Server error, please again!!!",
			};
		}
	}
};
