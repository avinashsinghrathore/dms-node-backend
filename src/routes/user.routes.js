const express = require("express");
const userController = require("../controller/user.controller");

const router = express.Router();

// Public Routes
router.post("/register", userController.createUserRegistration);
router.post("/login", userController.userLogin);
router.post("/send-reset-password-email", userController.sendUserPasswordResetEmail);
router.post("/reset-password/:id/:token", userController.userPasswordReset);
// router.post("/sendotp", userController.userOtpSend)

// crud routes
router.get("/", userController.getAllUserDetails);
router.get("/:id", userController.getUserDetails);


// Protected Routes
router.put("/:id", userController.replaceUserDetails);
router.patch("/:id", userController.updateUserDetails);
router.delete("/:id", userController.deleteUserDetails);

exports.router = router;