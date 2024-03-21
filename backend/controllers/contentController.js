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
const { sequelize,Content,Users, Comments } = require('../config/database');
const {hashPassword,verifyPassword} = require("../utils/password")

const uploadVideo = async (file) => {
  return new Promise((resolve, reject) => {
    const readStream = streamifier.createReadStream(file.buffer);
    cloudinary.uploader.upload_stream({ resource_type: 'video' }, 
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    ).end(file.buffer);
  });
}

exports.uploadContent = catchAsyncErrors(async (req, res) => {
  const data = req.body;
  const rules = {
      title: 'required',
      description: 'required|min:4',
  };
  const validation = new Validator(data, rules);
  if (validation.fails()) {
    return res.status(400).json({ errors: validation.errors.all() });
  }
  let videoMetaData;
  let content;
  if (req.file) {
    videoMetaData = await uploadVideo(req.file);
    const thumbnail = String(videoMetaData?.secure_url).split(".mp4")[0]+".png";
    content = await Content.create({
      title: data.title,
      description: data.description,
      thumbnail,
      videoUrl: videoMetaData?.secure_url,
      videoTime: videoMetaData?.duration,
      videoMetaData,
      createdUserId: req.user.userId,
    },{logging: console.log});
  } else {
    res.status(400).send('video file not found');
  }
  res.status(201).json({success:true,message:"video uploaded successfully",content});
})

exports.getContent = catchAsyncErrors(async (req, res) => {
  const contents = await Content.findAll({
    limit: req.query.offset || 20, 
    offset: req.query.offset || 0,
    include: [{
      model: Users,
      attributes: { exclude: ['password','resetPasswordToken','resetPasswordExpire'] },
  }],
  });
  res.status(200).json({success:true,contents});
})

exports.getContentDetails = catchAsyncErrors(async (req, res) => {
  const contentDetails = await Content.findByPk(req.params.id,{
    include: [{
      model: Users,
      attributes: { exclude: ['password','resetPasswordToken','resetPasswordExpire'] },
  }],
  });
  if (!contentDetails) {
    return res.status(400).json({ success: false, message: "video not found" });
  }
  res.status(200).json({success:true,contentDetails});
});


exports.getComments = catchAsyncErrors(async (req, res) => {
  const comments = await Comments.findAll({
    where: {commentVideoId: req.params.id},
    limit: req.query.offset || 20, 
    offset: req.query.offset || 0,
    include: [{
      model: Users,
      attributes: { exclude: ['password','resetPasswordToken','resetPasswordExpire'] },
  }],
  });
  if (!comments) {
    return res.status(400).json({ success: false, message: "no comments found" });
  }
  res.status(200).json({success:true,comments});
})


exports.addComment = catchAsyncErrors(async (req, res) => {
  const data = req.body;
  const rules = {
    commentMessage: 'required',
    commentUserId: 'required',
  };
  const validation = new Validator(data, rules);
  if (validation.fails()) {
    return res.status(400).json({ errors: validation.errors.all() });
  }
  const {commentMessage,commentUserId} = req.body;
  console.log(commentMessage,commentUserId,req.params.id)
  const comment = await Comments.create({
    commentUserId, commentMessage, commentVideoId: req.params.id
  });
  res.status(200).json({success:true,message: "Comment added successfully"});
})