const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Multer Storage
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

// Multer Upload Middleware
const upload = multer({
  storage,
}).single("video");

// Upload Controller
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
      const submittedAt = req.body.submittedAt;
      const answers = JSON.parse(req.body.answers || "[]");

      exec(
        `powershell -Command "Get-Process | Sort-Object ProcessName | Select-Object Id, ProcessName, CPU, WS"`,
        { maxBuffer: 1024 * 1024 * 20 },
        (error, stdout) => {
          const runningProcesses = error
            ? "Unable to fetch processes"
            : stdout;

          console.log("========== Interview ==========");
          console.log("Username:", username);
          console.log("Submitted At:", submittedAt);
          console.log("Answers:", answers);

          if (req.file) {
            console.log("Video Name:", req.file.filename);
            console.log("Video Path:", req.file.path);
          }

          console.log("Running Processes:");
          console.log(runningProcesses);

          // TODO: Save everything to database here

          res.json({
            success: true,
            message: "Interview uploaded successfully",
            username,
            submittedAt,
            answers,
            video: req.file ? req.file.filename : null,
          });
        }
      );
    } catch (e) {
      console.log(e);

      res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  });
};