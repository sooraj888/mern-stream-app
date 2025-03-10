const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    const message = `Resource not Found. Invalid: {${err.path}}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err?.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  //JWT Invalid token error
  if (err.name === "JsonWebTokenError") {
    const message = "Json web token is invalid, try again";
    err = new ErrorHandler(message, 400);
  }

  // JWT Expire Error
  if (err.name === "JsonWebTokenExpireError") {
    const message = "Json web token is Expire, try again";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
    errorDetails: err.stack,
  });
};
