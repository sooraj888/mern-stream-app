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
const Validator = require('validatorjs');
const {Op} = require('sequelize');
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
        overwrite: true,
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
  const data = req.body;
  const rules = {
      email: 'required|email',
      password: 'required|min:8',
      userName: 'required|min:4'
  };
  const validation = new Validator(data, rules);
  if (validation.fails()) {
    return res.status(400).json({ errors: validation.errors.all() });
  }
  const hashedPassword =await hashPassword(password)
  let user;
  if (req.file?.buffer) {
    const result = await uploadStream(req.file);
    user = await Users.create({userName,email,password:hashedPassword,avatar: {
        public_id: result.public_id,
        url: result.secure_url,
      }});
  } else {
     user = await Users.create({userName,email,password:hashedPassword});
  }
  user.password = undefined;
  sendToken(user, 200, res);
});



//! ----------------------- Login a User -----------------------------

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  const data = req.body;
  const rules = {
      email: 'required|email',
      password: 'required|min:8',
  };
  const validation = new Validator(data, rules);
  if (validation.fails()) {
    return res.status(400).json({ errors: validation.errors.all() });
  }

  let user = await Users.findOne({ where: { email } });
  if (!user) {
    return next(new ErrorHandler("Invalid Email and Password", 401));
  }

  const isPasswordMatched = await verifyPassword(password,user.password);
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
  const user = await Users.findOne({ where: { email: req.body.email }});
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  // Get ResetPassword Token
  const [resetPasswordToken,resetPasswordExpire] = user.getResetPasswordToken();
  console.log(resetPasswordToken,resetPasswordExpire)
  await Users.update({
    resetPasswordToken: String(resetPasswordToken),
    resetPasswordExpire: resetPasswordExpire
  }, { where: { email: req.body.email } });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/passwordReset/${resetPasswordToken}`;

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
    await Users.update({
      resetPasswordToken: null,
      resetPasswordExpire: null
    }, {
      where: {
        email: req.body.email
      }
    });
    return next(new ErrorHandler(error.message, 500));
  }
});

//! ------------------------ Reset Password Without Old Password -----------------------------
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await Users.findOne({logging: console.log, where :{
    resetPasswordToken: req.params.token,
    resetPasswordExpire: { [Op.gt]: Date.now() },
  }});


  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password token is invalid or has been expired",
        404
      )
    );
  }
  const hashedPassword =await hashPassword(req.body.password)
  await Users.update({
    password: hashedPassword,
    resetPasswordToken: null,
    resetPasswordExpire: null
  }, {
    where: {
      email: user.email
    }
  });
  user.resetPasswordToken =  undefined;
  user.resetPasswordExpire= undefined;
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
  const { userName, email, password } = req.body;
  let result;
  const updateObject = {
    userName,
    email,
    // password,
  }
  const public_id= req.user?.avatar?.public_id;
  if (req.file?.buffer) {
    if (!public_id) {
      return next(new ErrorHandler("public_id required", 400));
    }
    result = await updateStream(req.file, public_id);
    console.log(result);
    updateObject.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    }
  } 
  await Users.update(updateObject,
    {
      logging: console.log,
      where: {
        userId: req.user.userId,
      },
    }
  );
  // console.log("user",user)
  const updatedUser = await Users.findOne({ where: { userId:req.user.userId } });
  updatedUser.password = undefined;
  sendToken(updatedUser, 200, res);
  // res.status(200).json({ success: req.user });
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



exports.deleteMyAccount = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  await cloudinary.uploader.destroy(req.user.avatar.public_id, function (result) {});
  await Users.destroy({ where: { userId: user.userId } });
  res.status(200).json({ success: true,message:"Account Deleted Successfully" });
});