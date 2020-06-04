const router = require("express").Router();
const userRouter = require("./user.router");
const authRouter = require('./auth.router');
const weatherRouter = require('./weather.router');
const postsRouter = require('./posts.router');
const chatsRouter = require('./chats.router');
const commentRouter = require('./comment.router');
const eventsRouter = require('./events.router');

router.get("/status", (req, res) => {
	res.json({
		message: "OK",
		timestamp: new Date().toISOString(),
		IP: req.ip,
		URL: req.originalUrl
	});
});

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/weather', weatherRouter);
router.use('/posts', postsRouter);
router.use('/chats', chatsRouter);
router.use('/comments', commentRouter);
router.use('/events', eventsRouter);

module.exports = router;
