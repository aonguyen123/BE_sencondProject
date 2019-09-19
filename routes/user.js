const userController = require('./../controller/user');
const passport = require('passport');
const testController = require('./../controller/testController');
const router = require('express').Router();

router.post('/register', (req, res) => {
    userController.register(req, res);
});
router.post('/login', (req, res) => {
    userController.login(req, res);
});
router.get('/me',passport.authenticate('jwt', { session: false }), (req, res) => {
    userController.getMe(req, res);
})

    //test
router.get('/getAllData', (req, res) => {
    testController.getAllData(req, res);
})
router.post('/createUser', (req, res) => {
    testController.createUser(req, res);
})
router.post('/createSV', (req, res) => {
    testController.createSV(req, res);
});
router.get('/checkSV', (req, res) => {
    testController.checkSV(req, res);
})
router.put('/updateTime', (req, res) => {
    testController.updateTime(req, res);
});
router.post('/dangnhap', (req, res) => {
    testController.dangnhap(req, res);
})
router.post('/getFile', (req, res) => {
    testController.file(req, res);
});
module.exports = router;