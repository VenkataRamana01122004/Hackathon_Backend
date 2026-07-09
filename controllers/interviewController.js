const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const Interview = require("../models/Interview");

// ================= Multer Storage =================
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

// ================= Upload Controller =================
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

            const userId = req.body.userId;
const submittedAt = req.body.submittedAt;

const interviewStartTime = req.body.interviewStartTime;
const interviewEndTime = req.body.interviewEndTime;
const totalInterviewTime = Number(req.body.totalInterviewTime);
const timeTaken = Number(req.body.timeTaken);
const tabSwitchCount = Number(req.body.tabSwitchCount);

const answers = JSON.parse(req.body.answers || "[]");

      exec(
        `powershell -Command "Get-Process | Sort-Object ProcessName | Select-Object Id, ProcessName, CPU, WS"`,
        { maxBuffer: 1024 * 1024 * 20 },
        async (error, stdout) => {
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

          const processNames = [
            ...new Set(
              stdout
                .split(/\r?\n/)
                .map((line) => line.trim().split(/\s+/)[1]) // ProcessName column
                .filter(
                  (name) =>
                    name &&
                    name !== "ProcessName" &&
                    name !== "-----------"
                )
            ),
          ];

          const ipAddress =
            req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.socket.remoteAddress;

          try {
            // const interview = await Interview.create({
            //   userId,
            //   submittedAt,
            //   answers,
            //   videoName: req.file ? req.file.filename : null,
            //   videoPath: req.file ? req.file.path : null,
            //   processes: processNames,
            // });

            const interview = await Interview.create({
              userId,
              submittedAt,
              interviewStartTime,
              interviewEndTime,
              totalInterviewTime,
              timeTaken,
              tabSwitchCount,
              ipAddress,
              answers,
              processes: processNames,
              videoName: req.file.filename,
              videoPath: req.file.path,
            });

            res.status(201).json({
              success: true,
              message: "Interview uploaded successfully.",
              interview,
            });
          } catch (dbError) {
            console.error(dbError);

            res.status(500).json({
              success: false,
              message: dbError.message,
            });
          }
        }
      );
    } catch (e) {
      console.error(e);

      res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  });
};