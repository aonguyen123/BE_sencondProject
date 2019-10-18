const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const lopSchema = new Schema({
    malop: {
        type: String,
        required: true
    },
    tenlop: {
        type: String,
        required: true
    },
    timeStart: {
        type: String,
        required: true
    },
    timeEnd: {
        type: String,
        required: true
    },
    dssv: [
        {
            mssv: {
                type: String,
                require: true
            },
            ten: {
                type: String,
                require: true
            },
            ngaysinh: {
                type: String,
                require: true
            },
            da_kiemdien: {
                type: Boolean,
                require: true
            }
        }
    ],
    dsngay: [
        {
            ngay: {
                type: String,
                default: ''
            }
        }
    ]
})
const lop = mongoose.model('LOP', lopSchema);
module.exports = lop;