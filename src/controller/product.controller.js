const fs = require("fs");
const model = require("../model/product.model");
const Product = model.Product;

const { info } = require("console");


// create - add new product
exports.addNewProduct = async (req, res) => {
  try {
    const doc = new Product(req.body);
    await doc.save();
    console.log(doc);
    res.status(201).json(doc);
  } catch (error) {
    console.log(error);
    req.status(400).json(error);
  }
};

// Read - allproduct - find - method
exports.getAllProductDetails = async (req, res) => {
  try {
    const doc = await Product.find();
    console.log(doc);
    res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};


// Delete method - delete product
exports.deleteProductDetails = async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await Product.findOneAndDelete({ _id: id });
    res.status(201).json(doc);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
