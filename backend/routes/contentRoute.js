const express = require("express");
const {
    uploadContent,getContent, getContentDetails,getComments,addComment
} = require("../controllers/contentController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");
const router = express.Router();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const upload = multer({ storage: multer.memoryStorage(),limits: { fileSize: 103809024 /* bytes */ } });

router.post("/uploadVideo", upload.single("video"),isAuthenticatedUser, uploadContent);
router.get("/contentList",getContent)
router.get("/contentDetails/:id",getContentDetails);
router.get("/getComments/:id",getComments);
router.post("/addComment/:id",addComment);


module.exports = router;