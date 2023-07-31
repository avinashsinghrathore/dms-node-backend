const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  price: {
    type: Number,
    required: true,
    trim: true,
  },

  brand: {
    type: String,
    required: true,
    trim: true,
  },
});

exports.Product = mongoose.model("Product", productSchema);
