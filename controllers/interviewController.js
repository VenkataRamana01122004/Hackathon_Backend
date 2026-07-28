const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { spawn } = require("child_process");

const Interview = require("../models/Interview");
const Assessment = require("../models/Assignment");
const Bitsexam = require("../models/Bitsexam");
const MCQQuestion = require("../models/MCQQuestion");
const Question = require("../models/Question");
const Candidate = require("../models/Candidate");


const { generateMCQs,generateCodingQuestions } = require("../controllers/gptModel");

// ================= Multer Storage for Interviews =================
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

// ================= Multer Storage for Assignments =================
const assignmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads/assignments");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `assignment_video_${Date.now()}.webm`);
  },
});

const uploadAssignmentVideo = multer({ storage: assignmentStorage }).single("evidenceVideo");

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
      // const answers = JSON.parse(req.body.answers || "[]");
      const rawAnswers = JSON.parse(req.body.answers || "[]");

        const answers = rawAnswers.map((item, index) => ({
          ...item,
          aiScore: 5 + index,
          employeeScore: null,
          explanation: "HlO",
        }));

      exec(
        `powershell -Command "Get-Process | Sort-Object ProcessName | Select-Object Id, ProcessName, CPU, WS"`,
        { maxBuffer: 1024 * 1024 * 20 },
        async (error, stdout) => {
          const runningProcesses = error ? "Unable to fetch processes" : stdout;

          // console.log("========== Interview ==========");
          // console.log("Username:", username);
          // console.log("Submitted At:", submittedAt);
          // console.log("Answers:", answers);

          // if (req.file) {
          //   console.log("Video Name:", req.file.filename);
          //   console.log("Video Path:", req.file.path);
          // }

          // console.log("Running Processes:");
          // console.log(runningProcesses);

          const processNames = [
            ...new Set(
              stdout
                .split(/\r?\n/)
                .map((line) => line.trim().split(/\s+/)[1])
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
              videoName: req.file ? req.file.filename : null,
              videoPath: req.file ? req.file.path : null,
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

// ================= Updated Assignment Submission Controller =================
exports.submitAssignment = (req, res) => {
  uploadAssignmentVideo(req, res, async (err) => {
    if (err) {
      console.error("Multer parsing error:", err);
      return res.status(500).json({
        success: false,
        message: "Failed parsing multipart assignment data.",
      });
    }

    try {
      if (!req.body.metadata) {
        return res.status(400).json({
          success: false,
          message: "Missing assignment metadata.",
        });
      }

      const data = JSON.parse(req.body.metadata);

      // console.log("\n================ ASSIGNMENT SUBMITTED ================\n");
      // console.log("User ID:", data.username);

      // console.log("\nAssignment");
      // console.log("----------------------------------");
      // console.log("Start :", data.assignmentStartTime);
      // console.log("End   :", data.assignmentEndTime);
      // console.log("Total :", data.totalTime);
      // console.log("Reason:", data.submitReason);
      // console.log("Timer Expired:", data.timerExpired);

      // console.log("\nProctoring");
      // console.log("----------------------------------");
      // console.log("Tab Switches         :", data.proctoring?.tabSwitchCount);
      // console.log("Blur Events          :", data.proctoring?.blurCount);
      // console.log("Fullscreen Exits     :", data.proctoring?.fullscreenExitCount);
      // console.log("Mouse Clicks         :", data.proctoring?.mouseClicks);
      // console.log("Mouse Movements      :", data.proctoring?.mouseMoveCount);
      // console.log("Copy Attempts        :", data.proctoring?.copyAttempts);
      // console.log("Cut Attempts         :", data.proctoring?.cutAttempts);
      // console.log("Paste Attempts       :", data.proctoring?.pasteAttempts);
      // console.log("Right Click Attempts :", data.proctoring?.rightClickAttempts);
      // console.log("Idle Time (sec)      :", data.proctoring?.idleTimeSeconds);
      // console.log("Total Keys           :", data.proctoring?.totalKeyPresses);

      // console.log("\nKeyboard Logs");
      // console.table(data.proctoring?.keyboardLogs || []);

      if (req.file) {
        // console.log("\nEvidence Video");
        // console.log("----------------------------");
        // console.log("Video Name :", req.file.filename);
        // console.log("Video Path :", req.file.path);

        data.evidenceVideoName = req.file.filename;
        data.evidenceVideoPath = req.file.path;
      } else {
        console.log("\nNo video uploaded.");
      }

      // if (data.candidateSystemInfo) {
      //   console.log("\nCandidate System Information");
      //   console.log("----------------------------");
      //   console.log("User Agent :", data.candidateSystemInfo.userAgent);
      //   console.log("Resolution :", data.candidateSystemInfo.screenResolution);
      // }

      // console.log("\n============= ANSWERS =============\n");

      // if (Array.isArray(data.answers)) {
      //   data.answers.forEach((answer, index) => {
      //     console.log("--------------------------------------------");
      //     console.log(`Question ${index + 1}`);
      //     console.log("Question ID :", answer.questionId);
      //     console.log("Language    :", answer.language);
      //     console.log("Source Code :");
      //     console.log(answer.code);
      //     console.log("--------------------------------------------\n");
      //   });
      // } else {
      //   console.log("No answers received.");
      // }

      // console.log("============= END OF ANSWERS =============\n");

      // Save JSON locally
      const folder = path.join(__dirname, "../submissions");

      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }

      const filename = `assignment_${Date.now()}.json`;

      fs.writeFileSync(
        path.join(folder, filename),
        JSON.stringify(data, null, 2)
      );

      // Save into MongoDB
      await Assessment.create({
        userId: data.username,
        candidateName: data.candidate,

        assignmentStartTime: data.assignmentStartTime,
        submittedAt: data.assignmentEndTime,
        totalTime: data.totalTime,

        submitReason: data.submitReason,
        timerExpired: data.timerExpired,

        videoName: req.file?.filename || null,
        videoPath: req.file?.path || null,

        systemInfo: data.candidateSystemInfo || {},

        proctoring: data.proctoring || {},

        answers: data.answers || [],

        ipAddress:
          req.headers["x-forwarded-for"]?.split(",")[0] ||
          req.socket.remoteAddress ||
          req.ip,
      });


      await Candidate.update({codingExamStatus: "Process",},{where: {id: data.username,},});

      // Send response ONLY ONCE
      return res.status(200).json({
        success: true,
        message: "Assignment Submitted Successfully",
      });

    } catch (error) {
      console.error("Submission Error:", error);

      return res.status(500).json({
        success: false,
        message: "Submission Failed",
        error: error.message,
      });
    }
  });
};

exports.submitbitsassessment = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Upload Error:", err);

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    try {
      // Parse JSON fields
      const answers = JSON.parse(req.body.answers || "[]");
      const statuses = JSON.parse(req.body.statuses || "[]");
      const questions = JSON.parse(req.body.questions || "[]");
      const questionIds = questions.map(question => question.id);
      const violations = JSON.parse(req.body.violations || "{}");
      const logs = JSON.parse(req.body.logs || "[]");
      const systemInfo = JSON.parse(req.body.systemInfo || "{}");

      // console.log("\n========== EXAM SUBMISSION ==========\n");

      // console.log("User ID       :", req.body.username);
      // console.log("Candidate     :", req.body.candidate);
      // console.log("Time Left     :", req.body.timeLeft);

      // console.log("\n----- Answers -----");
      // console.log(answers);

      // console.log("\n----- Statuses -----");
      // console.log(statuses);

      // console.log("\n----- Questions -----");
      // console.log(questions);

      // console.log("\n----- Violations -----");
      // console.log(violations);

      // console.log("\n----- Logs -----");
      // console.log(logs);

      // console.log("\n----- System Info -----");
      // console.log(systemInfo);

      // if (req.file) {
      //   console.log("\n----- Video -----");
      //   console.log("Video Name :", req.file.filename);
      //   console.log("Video Path :", req.file.path);
      // } else {
      //   console.log("\nNo video uploaded.");
      // }

      // console.log("\n=====================================\n");

      // Save into database
      const submission = await Bitsexam.create({
        userId: req.body.username,
        candidateName: req.body.candidate,

        timeLeft: Number(req.body.timeLeft),

        answers,
        statuses,
        questions:questionIds,
        violations,
        logs,
        systemInfo,

        videoName: req.file ? req.file.filename : null,
        videoPath: req.file ? req.file.path : null,

        ipAddress:
          req.headers["x-forwarded-for"]?.split(",")[0] ||
          req.socket.remoteAddress ||
          req.ip,
      });

            await Candidate.update({bitsExamStatus: "Process",},{where: {id: req.body.username,},});


      return res.status(200).json({
        success: true,
        message: "Exam submitted successfully.",
        submissionId: submission.id,
      });

    } catch (error) {
      console.error("Submission Error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to submit exam.",
        error: error.message,
      });
    }
  });
};


exports.generateQuestions = async (req, res) => {
  try {
    const { topic,category, count } = req.body;

    const questions = await generateMCQs(topic,category, count);

    const savedQuestions = await MCQQuestion.bulkCreate(questions);

    res.status(201).json({
      success: true,
      message: "Questions generated successfully",
      data: savedQuestions,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.generateCodingQuestions = async (req, res) => {
  try {
    const { topic, category, count = 5 } = req.body;

    if (!topic || !category) {
      return res.status(400).json({
        success: false,
        message: "Topic and category are required.",
      });
    }

    // Generate coding questions using AI
    const questions = await generateCodingQuestions(
      topic,
      category,
      count
    );

    // Save to database
    const savedQuestions = await Question.bulkCreate(questions);

    res.status(201).json({
      success: true,
      message: `${savedQuestions.length} coding questions generated successfully.`,
      data: savedQuestions,
    });
  } catch (err) {
    console.error("Generate Questions Error:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Failed to generate questions.",
    });
  }
};

// exports.transcribeAudio = async (req, res) => {

//     if (!req.file) {
//         return res.status(400).json({
//             message: "Audio not found"
//         });
//     }

//     const python = spawn("python", [
//         "./whisper/transcribe.py",
//         req.file.path
//     ]);

//     let transcript = "";

//     python.stdout.on("data", (data) => {
//         transcript += data.toString();
//     });

//     python.stderr.on("data", (data) => {
//         console.log(data.toString());
//     });

//     python.on("close", () => {

//         res.json({
//             transcript
//         });

//     });

// };


const browserInterviewUpload = multer({
  storage,
}).fields([
  { name: "interviewVideo", maxCount: 1 },
  { name: "audios", maxCount: 20 },
]);

function transcribeAudio(filePath) {
  return new Promise((resolve, reject) => {

    const python = spawn("python", [
      "./whisper/transcribe.py",
      filePath,
    ]);

    let transcript = "";
    let error = "";

   python.stdout.on("data", (data) => {
    transcript += data.toString("utf8");
});

    python.stderr.on("data", (data) => {
      error += data.toString();
    });

    python.on("close", (code) => {
      if (code === 0) {
        resolve(transcript.trim());
      } else {
        reject(error);
      }
    });

  });
}

exports.uploadInterviewbrowser = (req, res) => {
browserInterviewUpload(req, res, async (err) => { 
     if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    try {
      const {
        username,
        userId,
        submittedAt,
        interviewStartTime,
        interviewEndTime,
        totalInterviewTime,
        timeTaken,
        tabSwitchCount,
      } = req.body;

      // Questions sent from frontend
      const questions = JSON.parse(req.body.questions || "[]");
      const videoFile = req.files.interviewVideo
  ? req.files.interviewVideo[0]
  : null;

const audioFiles = req.files.audios || [];

      console.log("Questions:", questions);
      console.log("Video:", videoFile);
console.log("Audios:", audioFiles);

      // Build answers (replace this with Whisper transcription later)
      const answers = [];

for (let i = 0; i < audioFiles.length; i++) {

  const file = audioFiles[i];;
  const question = questions[i];

  const transcript = await transcribeAudio(file.path);

  answers.push({
    questionNo: question.questionNo,
    question: question.question,
    answer: transcript,
    aiScore: null,
    employeeScore: null,
    explanation: null,
  });

}

      const { exec } = require("child_process");

      exec(
        `powershell -Command "Get-Process | Sort-Object ProcessName | Select-Object ProcessName"`,
        { maxBuffer: 1024 * 1024 * 20 },
        async (error, stdout) => {
          try {
            const processNames = stdout
              ? [
                  ...new Set(
                    stdout
                      .split(/\r?\n/)
                      .map((line) => line.trim())
                      .filter(
                        (line) =>
                          line &&
                          line !== "ProcessName" &&
                          !line.startsWith("---")
                      )
                  ),
                ]
              : [];

            const ipAddress =
              req.headers["x-forwarded-for"]?.split(",")[0] ||
              req.socket.remoteAddress;

            const interview = await Interview.create({
              userId,
              submittedAt,
              interviewStartTime,
              interviewEndTime,
              totalInterviewTime: Number(totalInterviewTime),
              timeTaken: Number(timeTaken),
              tabSwitchCount: Number(tabSwitchCount),
              ipAddress,
              answers,
              processes: processNames,

              // Store all uploaded files
             videoName: videoFile ? videoFile.filename : null,

videoPath: videoFile ? videoFile.path : null,
            });

            res.status(201).json({
    success: true,
    message: "Interview uploaded successfully.",
    interview,
    answers
});
          } catch (dbError) {
            console.error(dbError);

            return res.status(500).json({
              success: false,
              message: dbError.message,
            });
          }
        }
      );
    } catch (e) {
      console.error(e);

      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  });
};