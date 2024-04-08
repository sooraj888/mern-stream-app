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
const Validator = require("validatorjs");
const { Op, where } = require("sequelize");
cloudinary.config({
  cloud_name: "drsqqay9m",
  api_key: "825267688972368",
  api_secret: "PTHBxwVaSuk5RbFXfpogTmH_aBE",
});
// Create a Multer instance with a memory storage

const { QueryTypes } = require("sequelize");
const {
  sequelize,
  Content,
  Users,
  Comments,
  Likes,
} = require("../config/database");
const { hashPassword, verifyPassword } = require("../utils/password");

const uploadVideo = async (file) => {
  return new Promise((resolve, reject) => {
    const readStream = streamifier.createReadStream(file.buffer);
    cloudinary.uploader
      .upload_stream({ resource_type: "video" }, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      })
      .end(file.buffer);
  });
};

exports.uploadContent = catchAsyncErrors(async (req, res) => {
  const data = req.body;
  const rules = {
    title: "required",
    description: "required|min:4",
  };
  const validation = new Validator(data, rules);
  if (validation.fails()) {
    return res.status(400).json({ errors: validation.errors.all() });
  }
  let videoMetaData;
  let content;
  if (req.file) {
    videoMetaData = await uploadVideo(req.file);
    const thumbnail =
      String(videoMetaData?.secure_url).split(".mp4")[0] + ".png";
    content = await Content.create({
      title: data.title,
      description: data.description,
      thumbnail,
      videoUrl: videoMetaData?.secure_url,
      videoTime: videoMetaData?.duration,
      videoMetaData,
      createdUserId: req.user.userId,
    });
  } else {
    res.status(400).send("video file not found");
  }
  res
    .status(201)
    .json({ success: true, message: "video uploaded successfully", content });
});

exports.getContent = catchAsyncErrors(async (req, res) => {
  const whereObj = {};
  if (req.query.videoDetailID) {
    whereObj.videoId = { [Op.not]: req.query.videoDetailID };
  }
  if (req.query.createdUserId) {
    whereObj.createdUserId = req.query.createdUserId;
  }
  const contents = await Content.findAll({
    limit: req.query.limit || 20,
    offset: req.query.offset || 0,
    where: whereObj,
    include: [
      {
        model: Users,
        attributes: {
          exclude: [
            "password",
            "resetPasswordToken",
            "resetPasswordExpire",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    ],
    attributes: { exclude: ["videoMetaData"] },
  });
  res.status(200).json({ success: true, contents });
});

exports.searchContent = catchAsyncErrors(async (req, res) => {
  const contents = await Content.findAll({
    limit: req.query.limit || 20,
    offset: req.query.offset || 0,
    where: {
      [Op.or]: [
        { title: { [Op.like]: "%" + req.params.search + "%" } },
        { description: { [Op.like]: "%" + req.params.search + "%" } },
        { "$user.userName$": { [Op.like]: "%" + req.params.search + "%" } },
      ],
    },
    include: [
      {
        model: Users,
        as: "user",
        attributes: {
          exclude: [
            "password",
            "resetPasswordToken",
            "resetPasswordExpire",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    ],
    attributes: { exclude: ["videoMetaData"] },
    logging: console.log,
  });
  res.status(200).json({ success: true, contents });
});

exports.getContentDetails = catchAsyncErrors(async (req, res) => {
  const contentDetails = await Content.findByPk(req.params.id, {
    include: [
      {
        model: Users,
        attributes: {
          exclude: ["password", "resetPasswordToken", "resetPasswordExpire"],
        },
      },
    ],
  });
  if (!contentDetails) {
    return res.status(400).json({ success: false, message: "video not found" });
  }
  res.status(200).json({ success: true, contentDetails });
});

exports.updateViewCount = catchAsyncErrors(async (req, res) => {
  const data = req.body;
  const rules = {
    videoId: "required",
  };
  const validation = new Validator(data, rules);
  if (validation.fails()) {
    return res.status(400).json({ errors: validation.errors.all() });
  }
  const replacements = {
    videoId: data.videoId,
    // Add more dynamic values here
  };
  const contentDetails = await Content.update(
    {
      totalViews: sequelize.literal('"totalViews" + 1'),
    },
    {
      where: { videoId: replacements.videoId },
    }
  );
  if (!contentDetails) {
    return res
      .status(400)
      .json({ success: false, message: "View is not updated" });
  }
  res.status(200).json({ success: true, contentDetails });
});

exports.getComments = catchAsyncErrors(async (req, res) => {
  const comments = await Comments.findAll({
    where: { commentVideoId: req.params.id },
    order: [["createdAt", "DESC"]],
    limit: req.query.offset || 20,
    offset: req.query.offset || 0,
    logging: console.log,
    include: [
      {
        model: Users,
        as: "user",
        attributes: {
          exclude: ["password", "resetPasswordToken", "resetPasswordExpire"],
        },
      },
    ],
  });
  if (!comments) {
    return res
      .status(400)
      .json({ success: false, message: "no comments found" });
  }
  res.status(200).json({ success: true, comments });
});

exports.addComment = catchAsyncErrors(async (req, res) => {
  const data = req.body;
  const rules = {
    commentMessage: "required",
  };
  const validation = new Validator(data, rules);
  if (validation.fails()) {
    return res.status(400).json({ errors: validation.errors.all() });
  }
  const { commentMessage } = req.body;

  console.log("hii");
  let comment = await Comments.create(
    {
      commentUserId: req.user.userId,
      commentMessage,
      commentVideoId: req.params.id,
    },
    {
      include: [
        {
          model: Users,
          as: "user",
          attributes: {
            exclude: ["password", "resetPasswordToken", "resetPasswordExpire"],
          },
        },
      ],
    }
  );
  comment = await comment.reload();
  res
    .status(200)
    .json({ success: true, message: "Comment added successfully", comment });
});

exports.getLike = catchAsyncErrors(async (req, res) => {
  const data = req.query;
  const rules = {
    videoId: "required",
  };
  const validation = new Validator(data, rules);
  if (validation.fails()) {
    return res.status(400).json({ errors: validation.errors.all() });
  }

  const totalLikes = await Likes.count({
    where: { videoId: data.videoId, isLike: true },
  });
  const totalDisLikes = await Likes.count({
    where: { videoId: data.videoId, isLike: false },
  });
  let isUserLikeOrDisLike = null;
  if (req.user) {
    const isLiked = await Likes.findOne({
      where: { videoId: data.videoId, userId: req.user.userId },
    });
    if (isLiked) {
      isUserLikeOrDisLike = isLiked.isLike;
    }
  }
  const response = { success: true, totalLikes, totalDisLikes };
  if (isUserLikeOrDisLike != null) {
    response.isUserLikeOrDisLike = isUserLikeOrDisLike;
  }
  res.status(200).json(response);
});

exports.addLike = catchAsyncErrors(async (req, res) => {
  const data = req.body;
  const rules = {
    videoId: "required",
    isLike: "required|boolean",
    deleteLikeDisLike: "boolean",
  };
  const validation = new Validator(data, rules);
  if (validation.fails()) {
    return res.status(400).json({ errors: validation.errors.all() });
  }
  const isAlreadyLiked = await Likes.findOne({
    where: { videoId: data.videoId, userId: req.user.userId },
  });
  if (data?.deleteLikeDisLike) {
    await Likes.destroy({
      where: { videoId: data.videoId, userId: req.user.userId },
    });
  } else {
    if (isAlreadyLiked?.userId) {
      await Likes.update(
        { isLike: data.isLike },
        { where: { videoId: data.videoId, userId: req.user.userId } }
      );
    } else {
      await Likes.create({
        videoId: data.videoId,
        isLike: data.isLike,
        userId: req.user.userId,
      });
    }
  }

  const response = { success: true };
  res.status(200).json(response);
});
