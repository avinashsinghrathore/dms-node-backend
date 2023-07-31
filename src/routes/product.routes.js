const express = require("express");
const productController = require("../controller/product.controller");

const router = express.Router();

// router
//   .get('/', studentController.getAllStudentDetails)
//   .get('/:id', studentController.getStudentDetails)
//   .put('/:id', studentController.replaceStudentDetails)
//   .patch('/:id', studentController.updateStudentDetails)
//   .delete('/:id', studentController.deleteStudentDetails);
// exports.router = router;

// crud routes
router.post("/add-product", productController.addNewProduct);
router.get("/", productController.getAllProductDetails);
// router.get("/:id", productController.getProductDetails);

// // Protected Routes
// router.put("/:id", userController.replaceUserDetails);
// router.patch("/:id", userController.updateUserDetails);
// router.delete("/:id", userController.deleteUserDetails);

exports.router = router;
