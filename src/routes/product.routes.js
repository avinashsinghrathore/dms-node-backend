const express = require("express");
const productController = require("../controller/product.controller");

const router = express.Router();

// crud routes
router.post("/add-product", productController.addNewProduct);
router.get("/get-all-products", productController.getAllProductDetails);
router.get("/:id", productController.getProductDetails);

// Protected Routes
router.patch("/:id", productController.updateProductDetails);
router.delete("/delete-product/:id", productController.deleteProductDetails);

exports.router = router;
