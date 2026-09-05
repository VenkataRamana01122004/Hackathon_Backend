const express = require("express");
const router = express.Router();

const {
  uploadInterview,submitAssignment,submitbitsassessment,generateQuestions,
  generateCodingQuestions,uploadInterviewbrowser
} = require("../controllers/interviewController");

router.post("/upload", uploadInterview);
router.post("/uploadbrowser", uploadInterviewbrowser);
router.post("/submitAssignment", submitAssignment);
router.post("/submitbitsassessment", submitbitsassessment);
router.post("/generate",generateQuestions);
router.post("/generatecodingquestions",generateCodingQuestions);

// const interviewController = require("../controllers/interviewController");

// const multer = require("multer");

// const upload = multer({
//     dest: "uploads/"
// });

// router.post(
//     "/transcribe",
//     upload.single("audio"),
//     interviewController.transcribeAudio
// );

const {
  compileCode,
} = require("../controllers/compilerController");

router.post("/compile", compileCode);


module.exports = router;