const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const username = req.body.username || "guest";

    const dir = path.join(__dirname, "../uploads", username);

    fs.mkdirSync(dir, { recursive: true });

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    cb(null, `interview_${Date.now()}.webm`);
  },
});

const upload = multer({ storage }).single("video");

exports.uploadInterview = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    try {
      const username = req.body.username;

      // These are sent as JSON strings in FormData
      const answers = JSON.parse(req.body.answers || "[]");

      const runningProcesses = req.body.runningProcesses || "";

      const submittedAt = req.body.submittedAt;

      console.log("Username:", username);
      console.log("Submitted:", submittedAt);
      console.log("Answers:", answers);
      console.log("Processes:", runningProcesses);

      console.log(
        "Video:",
        req.file ? req.file.filename : "No video uploaded"
      );

      // TODO: Save everything to your database here

      res.json({
        success: true,
        message: "Interview uploaded successfully",
        video: req.file ? req.file.filename : null,
        answersCount: answers.length,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
};