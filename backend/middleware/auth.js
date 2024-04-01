const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { Users } = require("../config/database");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please Login to Access this resource", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await Users.findByPk(decodedData.id);
  if (req.user){
    req.user.password = undefined;
    next();
  } else {
    return next(new ErrorHandler("User Not Found", 401));
  }
});

exports.isAVerifiedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Users.findByPk(decodedData.id);
  }
  if (req.user){
    req.user.password = undefined;
  } 
  return next();
});

exports.authorizeRole = (...roles) => {
  return catchAsyncErrors(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role : ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  });
};
