const router = require('express').Router();
const chatsController = require('./../../controllers/chats.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.route('/getStatusChat').get(authMiddleware, chatsController.getStatusChat);
router.route('/getRooms').get(authMiddleware, chatsController.getRooms);
router.route('/getChats').get(authMiddleware, chatsController.getChats);
router.route('/checkJoinRoom/idRoom=:idRoom&idUser=:idUser').get(authMiddleware, chatsController.checkJoinRoom);

module.exports = router;
