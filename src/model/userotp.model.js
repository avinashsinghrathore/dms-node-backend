const mongoose = require('mongoose')
const validator = require("validator")
const { Schema } = mongoose

const userOtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Not valid email")
            }
        }
    },
    otp: {
        type: String,
        required: true
    }
})

exports.Userotp = mongoose.model('Userotp', userOtpSchema)