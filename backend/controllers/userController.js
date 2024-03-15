const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const streamifier = require("streamifier");
// import {v2 as cloudinary} from 'cloudinary';

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "drsqqay9m",
  api_key: "825267688972368",
  api_secret: "PTHBxwVaSuk5RbFXfpogTmH_aBE",
});
// Create a Multer instance with a memory storage

const { QueryTypes } = require('sequelize');
const { sequelize,Users } = require('../config/database');
const {hashPassword,verifyPassword} = require("../utils/password")

async function uploadStream(file) {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}
async function updateStream(file, public_id) {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      {
        public_id: public_id,
        invalidate: true,
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}
//! ----------------------- Register a User ----------------------------

exports.registerUser = catchAsyncErrors(async (req, res) => {
  const { userName, email, password } = req.body;

  
  // const [results, metadata] = await sequelize.query("SELECT * FROM users", {
  //   type: QueryTypes.SELECT
  // });
  const hashedPassword =await hashPassword(password)
  const results = await Users.create({userName,email,password:hashedPassword});

  await res.status(500).json({ message: "Hii",results});
});



//! ----------------------- Login a User -----------------------------

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if a user provided email and password
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email and Password", 400));
  }

  let user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email and Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email and Password", 401));
  }

  user.password = undefined;

  sendToken(user, 200, res);
});

//! ------------------------ Logout User -------------------------

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
  res.status(200).json({
    success: true,
    message: "User Logged out Successfully",
  });
});

//! ------------------------ Forgot password ---------------------------

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = await user.getResetPasswordToken();
  // user.resetPasswordToken = resetToken;
  await user.save({
    validateBeforeSave: false,
  });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/passwordReset/${resetToken}`;

  const message = `Your password reset token is :- \n\n  ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `E-commerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} Successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//! ------------------------ Reset Password Without Old Password -----------------------------
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password token is invalid or has been expired",
        404
      )
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});

//! ------------------------ User Details -----------------------------

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req?.user;
  res.status(200).json({ status: true, user: user });
});

//! ------------------------ Update Password With Old Password -----------------------------

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isUserPasswordMatch = await user.comparePassword(req.body.oldPassword);
  if (!isUserPasswordMatch) {
    return next(new ErrorHandler("Old password dose not match", 400));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

//! ------------------------ Update Profile -----------------------------

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, public_id } = req.body;
  let result;
  let user;
  if (req.file?.buffer) {
    if (!public_id) {
      return next(new ErrorHandler("public_id required", 400));
    }
    result = await updateStream(req.file, public_id);
    console.log(result);
    user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
        password,
        avatar: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
  } else {
    user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        email,
        password,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }
  user.password = undefined;

  sendToken(user, 200, res);
});

//! ------------------------ Get All users Admin -----------------------------

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({ success: true, users });
});

//! ------------------------ Get Single user Admin -----------------------------

exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ success: true, user });
});

//! ------------------------ Update Role Admin -----------------------------

exports.updateRole = catchAsyncErrors(async (req, res, next) => {
  const newRole = { role: req.body.role };
  const user = await User.findByIdAndUpdate(req.params.id, newRole, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, user });
});

//! ------------------------ Delete User Admin -----------------------------

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User dos't exist", 404));
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true });
});
