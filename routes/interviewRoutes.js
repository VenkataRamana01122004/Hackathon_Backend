const express = require("express");
const router = express.Router();

const {
  uploadInterview,
} = require("../controllers/interviewController");

router.post("/upload", uploadInterview);

const {
  compileCode,
} = require("../controllers/compilerController");

router.post("/compile", compileCode);


module.exports = router;