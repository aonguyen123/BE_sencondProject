const router = require("express").Router();
const userRouter = require("./user.router");
const authRouter = require('./auth.router');
const weatherRouter = require('./weather.router');
const postsRouter = require('./posts.router');

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

module.exports = router;
