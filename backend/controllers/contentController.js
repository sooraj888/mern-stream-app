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

exports.uploadContent = catchAsyncErrors(async (req, res) => {
  if (req.file) {
    const readStream = streamifier.createReadStream(req.file.buffer);
    cloudinary.uploader.upload_stream({ resource_type: 'video' }, 
      (error, result) => {
        if (error) {
          return res.status(500).send(error);
        }
        res.send(result);
      }
    ).end(req.file.buffer);
  } else {
    res.status(400).send('No file uploaded.');
  }
})
