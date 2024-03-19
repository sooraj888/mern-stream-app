const express = require("express");
const {
    uploadContent,getContent
} = require("../controllers/contentController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const router = express.Router();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const upload = multer({ storage: multer.memoryStorage(),limits: { fileSize: 103809024 /* bytes */ } });

router.post("/uploadVideo", upload.single("video"),isAuthenticatedUser, uploadContent);
router.get("/contentList",getContent)

module.exports = router;