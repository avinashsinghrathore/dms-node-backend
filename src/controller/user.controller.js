const fs = require("fs");
const model = require("../model/user.model");
const User = model.User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
// const dotenv = require("dotenv").config();

// const transporter = require("../config/email.config")

// const userotp = require("../model/userotp.model");
const { info } = require("console");

//email config
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user:process.env.EMAIL,
//     pass:process.env.PASSWORD
//   }
// })

  // email config for link to reset password
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: "avinashrathore121@gmail.com",  // hide this info
      pass: "bibnatlsfzibksny",             // hide this info
    },
  });


// create - user registration
exports.createUserRegistration = async (req, res) => {
  const {
    name,
    email,
    password,
    password_confirmation,
    phone_no,
    coupon_code,
    role,
    gst,
    pan,
  } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    res.send({ status: "failed", message: "email already exists" });
  } else {
    if (
      name &&
      email &&
      password &&
      password_confirmation &&
      phone_no &&
      coupon_code &&
      role &&
      gst &&
      pan
    ) {
      if (password === password_confirmation) {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);
          // const doc = new User(req.body);
          const doc = new User({
            name: name,
            email: email,
            password: hashPassword,
            phone_no: phone_no,
            coupon_code: coupon_code,
            role: role,
            pan: pan,
            gst: gst,
          });
          await doc.save();
          console.log(doc);
          const saved_user = await User.findOne({ email: email });
          // jwt token generate
          const token = jwt.sign(
            { userID: saved_user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "6d" }
          );
          // res.status(201).json(doc);
          res.send({
            status: "success",
            message: "Registration successful",
            token: token,
          });
        } catch (error) {
          console.log(error);
          // res.status(400).json(error);
          res.send({ status: "failed", message: "Unable to Register" });
        }
      } else {
        res.send({
          status: "failed",
          message: "password and confirm password doesn't match",
        });
      }
    } else {
      res.send({ status: "failed", message: "all fields are required" });
    }
  }
};

// login
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await User.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (user.email === email && isMatch) {
          //generate jwt token
          const token = jwt.sign(
            { userID: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "6d" }
          );
          res.send({
            status: "success",
            message: "Login Success",
            token: token,
          });
        } else {
          res.send({
            status: "failed",
            message: "Email or Password is not valid",
          });
        }
      } else {
        res.send({ status: "failed", message: "You are not registered user" });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  } catch (error) {
    console.log(error);
  }
};

// password reset
exports.sendUserPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  if (email) {
    const user = await User.findOne({ email: email });
    if (user) {
      const secret = user._id + process.env.JWT_SECRET_KEY;

      const token = jwt.sign({ userID: user._id }, secret, {
        expiresIn: "15m",
      });
      const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;
      console.log(link);

    
      //send email link to reset password
      const info = await transporter.sendMail({
        from: "avinashrathore121@gmail.com", // sender address
        to: user.email, // list of receivers
        subject: "Password Reset Link", // Subject line
        text: "Hello world?", // plain text body
        html: `<a href=${link}>click me</a> to reset password`, // html body
      });
      res.send({
        status: "success",
        message: "password reset link sent please check your email",
        info: info,
      });
    } else {
      res.send({ status: "failed", message: "email doesn't exists" });
    }
  } else {
    res.send({ status: "failed", message: "email is required" });
  }
};

// update password
exports.userPasswordReset = async (req, res) => {
  const { password, password_confirmation } = req.body;
  const { id, token } = req.params;
  const user = await User.findById(id);
  const new_secret = user._id + process.env.JWT_SECRET_KEY;
  try {
    jwt.verify(token, new_secret);
    if (password && password_confirmation) {
      if (password !== password_confirmation) {
        res.status({
          status: "failed",
          message: "New password and confirm new password doesn't match",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const newHashPassword = await bcrypt.hash(password, salt);
        await User.findByIdAndUpdate(user._id, {
          $set: {
            password: newHashPassword,
          },
        });
        res.send({ status: "success", message: "password reset successfully" });
      }
    } else {
      res.status({ status: "failed", message: "all fields are required" });
    }
  } catch (error) {
    console.log(error);
    res.status({ status: "failed", message: "invalid token" });
  }
};

// otp generate
// exports.userOtpSend = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     res.status(400).json({ error: "please enter your email" });
//   }

//   try {
//     const user = await users.findOne({ email: email });

//     if (user) {
//       const OTP = Math.floor(100000+Math.random()*900000)
//       const existEmail = await userotp.findOne({email: email})
//       if(existEmail) {
//         const updateData = await userotp.findByIdAndUpdate({_id:existEmail._id}, {
//           otp:OTP
//         }, {new: true}
//         )
//         await updateData.save()

//         const mailOptions = {
//           from:process.env.EMAIL,
//           to:email,
//           subject:"sending email for otp validation",
//           text:`OTP:- ${OTP}`
//         }

//         transporter.sendMail(mailOptions, (error, info) => {
//           if(error) {
//             console.log("error", error)
//             res.status(400).json({message: "email sent successfully"})
//           }
//         })

//       } else {
//         const saveOtpData = new userotp ({
//           email,otp: OTP
//         })
//         await saveOtpData.save()

//         const mailOptions = {
//           from:process.env.EMAIL,
//           to:email,
//           subject:"sending email for otp validation",
//           text:`OTP:- ${OTP}`
//         }

//         transporter.sendMail(mailOptions, (error, info) => {
//           if(error) {
//             console.log("error", error)
//             res.status(400).json({message: "email sent successfully"})
//           }
//         })

//       }

//     } else {
//       res.status(400).json({error: "this user not exist in our db"})
//     }

//   } catch (error) {
//     res.status(400).json({error: "invalid details", error})
//   }
// };

// Read - all - find - method
exports.getAllUserDetails = async (req, res) => {
  try {
    const doc = await User.find();
    console.log(doc);
    res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// read - findById - method
exports.getUserDetails = async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await User.findById(id);
    console.log(doc);
    res.status(200).json(doc);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// Update - findOneAndReplace - put - method
exports.replaceUserDetails = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedDetails = await User.findOneAndReplace({ _id: id }, req.body, {
      new: true,
    });
    res.status(201).json(doc);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

// update - findOneAndUpdate - patch - method
exports.updateUserDetails = async (req, res) => {
  const id = req.params.id;
  try {
    const updateDetail = await User.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.status(201).json(updateDetail);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);gwssvxwwssxh
  }
};

// Delete method
exports.deleteUserDetails = async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await User.findOneAndDelete({ _id: id });
    res.status(201).json(doc);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
