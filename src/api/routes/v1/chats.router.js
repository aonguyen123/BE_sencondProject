const router = require('express').Router();
const chatsController = require('./../../controllers/chats.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.route('/getRooms').get(authMiddleware, chatsController.getRooms);
router.route('/getChats').get(authMiddleware, chatsController.getChats);
router.route('/checkJoinRoom/idRoom=:idRoom&idUser=:idUser').get(authMiddleware, chatsController.checkJoinRoom);
//router.route('/fetchMessageInRoom/idRoom=:idRoom/page=:page&page_size=:page_size').get(authMiddleware, chatsController.fetchMessageRoom);

module.exports = router;
