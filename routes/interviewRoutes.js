const express = require("express");
const router = express.Router();

const {
  uploadInterview,
} = require("../controllers/interviewController");

router.post("/upload", uploadInterview);

module.exports = router;