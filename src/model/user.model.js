const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    trim: true,
  },

  phone_no: {
    type: Number,
    unique: true,
    required: true,
    trim: true,
  },

  role: {
    type: String,
    required: true,
    trim: true,
  },

  coupon_code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  gst: {
    type: String,
    required: true,
    trim: true,
  },

  pan: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10,
    trim: true,
  },
});

exports.User = mongoose.model("User", userSchema);
