const registerValid = require('./../validation/register');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('./../model/user');
const jwt = require('jsonwebtoken');
const SV = require('./../model/testUser');
const testSV = require('./../validation/testSV');
const loginValid = require('./../validation/login');

exports.getAllData = async (req, res) => {
    const listUser = await User.find();
    if(!listUser)
    {
        return res.status(400).json({
            success: false
        })
    }
    res.status(200).json({
        users: listUser
    })
}
exports.createUser = async (req, res) => {
    const { errors, isValid } = registerValid(req.body);
    if(!isValid)
    {
        return res.status(200).json({
            isSuccess: false,
            errors
        });
    }
    const user = await User.findOne({email: req.body.email});
    if(user)
    {
        const errors = {};
        errors.email = "email đã tồn tại";
        return res.status(200).json({
            isSuccess: false,
            errors
        });
    }
    const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
    });
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar
    });
    bcrypt.genSalt(10, (err, salt) => {
        if(err)
        {
            console.log('loi bcrypt', err);
        }
        else
        {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err)
                {
                    console.log('loi hash', err);
                }
                else
                {
                    newUser.password = hash;
                    newUser.save().then(user => {
                        res.json({
                            isSuccess: true
                        });
                    });
                }
            });
        }
    });
}
exports.createSV = async (req, res) => {
    const { errors, isValid } = testSV.checkSV(req.body);
    if(!isValid)
    {
        return res.json(errors);
    }
    const mssv = await SV.findOne({mssv: req.body.mssv});
    if(mssv)
    {
        return res.json({
            success: false,
            msg: 'Mã số sinh viên đã tồn tại'
        })
    }
    const newSV = new SV({
        mssv: req.body.mssv,
        ten: req.body.ten,
        checkTime: req.body.checkTime
    });
    newSV.save().then(sv => {
        res.json(sv);
    });
};
exports.checkSV = async (req, res) => {
    const { mssv } = req.query;
    if(!mssv)
    {
        return res.json({
            msg: 'Mã số sinh viên không tồn tại'
        })
    }
    const sv = await SV.findOne({mssv});
    if(!sv)
    {
        return res.json({
            isInList: false,
            msg: 'not found'
        })
    }
    res.json({
        isInList: true,
        msg: 'in list'
    })
};
exports.updateTime = async (req, res) => {
    const { isValid, errors } = testSV.checkUpdateTime(req.body);
    if(!isValid)
    {
        return res.json(errors);
    }
    const sv = await SV.findOneAndUpdate({mssv: req.body.mssv}, {checkTime: req.body.checkTime});
    if(!sv)
    {
        return res.json({
            msg: 'not found'
        })
    }
    res.json({
        msg: 'updated'
    })
}
exports.dangnhap = async (req, res) => {
    const { errors, isValid } = loginValid(req.body);
    if(!isValid)
    {
        return res.status(200).json(errors);
    }
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user)
    {
        errors.email = 'User không tồn tại';
        return res.status(200).json(errors);
    }
    bcrypt.compare(password, user.password).then(isMatch => {
        if(isMatch)
        {
            const payload = {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                email: user.email
            }
            jwt.sign(payload, 'secret', {
                expiresIn: 3600
            }, (err, token) => {
                if(err)
                {
                    console.log('Loi in Token', err);
                }
                else
                {
                    res.json({
                        success: true,
                        token: `Bearer ${token}`,
                        user
                    });
                }
            });
        }
        else
        {
            errors.password = 'Mật khẩu không đúng'
            return res.status(200).json(errors);
        }
    });
};
exports.file = async (req, res) => {
    console.log(req.body);
    res.send({
        msg: 'true'
    })
}