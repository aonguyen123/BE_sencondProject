const registerValid = require('./../validation/register');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('./../model/user');
const jwt = require('jsonwebtoken');
const SV = require('./../model/testUser');
const testSV = require('./../validation/testSV');
const loginValid = require('./../validation/login');

const formidable = require('formidable');
const fs = require('fs');
const XLSX = require('xlsx')
const lop = require('./../model/lopTest');

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
exports.createLop = async (req, res) => {
    const newLop = new lop({
        malop: req.body.malop,
        tenlop: req.body.tenlop,
        timeStart: req.body.timeStart,
        timeEnd: req.body.timeEnd
    })
    newLop.save().then(lop => {
        res.json({
            lop
        })
    })
}
exports.file = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.uploadDir = 'uploads/'
    form.parse(req, async (err, fields, files) => {
        if(err)
        {
            return res.json(err)
        }
        const fileName = files.file.name;
        const parts = fileName.split('.');
        const typeFile = (parts[parts.length - 1]);
        if(typeFile === 'xlsx')
        {
            const tmpPath = files.file.path;
            const newPath = form.uploadDir + files.file.name;
            fs.rename(tmpPath, newPath, err => {
                if(err) 
                {
                    return res.json(err);
                };
            })
            const workbook = XLSX.readFile(newPath);
            const sheet_name_list = workbook.SheetNames;
            const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            console.log(xlData);
            if(xlData)
            {
                const result = await lop.findOneAndUpdate({malop: 'MMKK'}, {dssv: xlData});
                if(!result)
                {
                    return res.json({
                        success: 'update dssv fail'
                    })    
                }
                return res.json({
                    result
                })    
            }
        }
        else
        {
            res.json({
                success: false
            })
        }
    });
}
exports.capnhatngay = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.uploadDir = 'uploads/'
    form.parse(req, async (err, fields, files) => {
        if(err)
        {
            return res.json(err)
        }
        const fileName = files.file.name;
        const parts = fileName.split('.');
        const typeFile = (parts[parts.length - 1]);
        if(typeFile === 'xlsx')
        {
            const tmpPath = files.file.path;
            const newPath = form.uploadDir + files.file.name;
            fs.rename(tmpPath, newPath, err => {
                if(err) 
                {
                    return res.json(err);
                };
            })
            const workbook = XLSX.readFile(newPath);
            const sheet_name_list = workbook.SheetNames;
            const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            console.log(xlData);
            if(xlData)
            {
                const result = await lop.findOneAndUpdate({malop: 'MMKK'}, {dsngay: xlData});
                if(!result)
                {
                    return res.json({
                        isSuccess: 'update ngay fail'
                    })    
                }
                return res.json({
                    result
                })    
            }
        }
        else
        {
            res.json({
                success: false
            })
        }
    });
};

exports.kiemdien = async (req, res) => {
    res.json({
        idLop: '5da939aba3c2ea1140993964',
        dssv: [
            {
                "_id": {
                    "$oid": "5da93f71ac69ef1758d48f8f"
                },
                "mssv": "3115410004",
                "ten": "nguyen duc ao",
                "ngaysinh": "20/05/1996"
            },
            {
                "_id": {
                    "$oid": "5da93f71ac69ef1758d48f8e"
                },
                "mssv": "3115410016",
                "ten": "truong tuan dieu",
                "ngaysinh": "21/12/1996"
            },
            {
                "_id": {
                    "$oid": "5da93f71ac69ef1758d48f8a"
                },
                "mssv": "3115410072",
                "ten": "phan hoang tuan",
                "ngaysinh": "21/11/1996"
            }
        ],
        dsKiemdien: [
            {
                mssv: '3115410016',
                ngaykiemdien: '10/10/2019'
            },
            {
                mssv: '3115410004',
                ngaykiemdien: '12/10/2019'
            },
            {
                mssv: '3115410016',
                ngaykiemdien: '12/10/2019'
            },
        ]
    });
};