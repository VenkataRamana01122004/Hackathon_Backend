const multer = require("multer");
const fs = require("fs");
const path = require("path");

const Manager = require("../models/Manager");
const Employee = require("../models/Employee");
const Candidate = require("../models/Candidate");
const Question = require("../models/Question");
const MCQQuestion = require("../models/MCQQuestion");
const Assessment = require("../models/Assignment")
const Bitsexam = require("../models/Bitsexam")
const Interview = require("../models/Interview");
const InterviewQuestion = require("../models/InterviewQuestion");
const { Sequelize } = require("sequelize");


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

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      order: [["createdAt", "DESC"]],
      limit: 3
    });
     setTimeout(() => {
      return res.status(200).json({
        success: true,
        count: questions.length,
        data: questions,
      });
    }, 2000);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
      error: error.message,
    });
  }
};

const getMcqQuestions = async (req, res) => {
  try {
    const questions = await MCQQuestion.findAll({
      order: Sequelize.literal("RAND()"),
      limit: 10,
    });

    setTimeout(() => {
      return res.status(200).json({
        success: true,
        count: questions.length,
        data: questions,
      });
    }, 2000);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions.",
      error: error.message,
    });
  }
};

const uploadInterview = (req, res) => {
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

const getInterviewQuestions = async (req, res) => {
  try {
    // Declare required counts
    const hrCount = 1;
    const behaviorCount = 1;
    const technicalCount = 1;

    // Fetch questions by type
    const [hrQuestions, behaviorQuestions, technicalQuestions] =
      await Promise.all([
        InterviewQuestion.findAll({
          where: { questionType: "HR", isActive: true },
        }),
        InterviewQuestion.findAll({
          where: { questionType: "Behavioral", isActive: true },
        }),
        InterviewQuestion.findAll({
          where: { questionType: "Technical", isActive: true },
        }),
      ]);

    // Randomly shuffle and select the required count
    const getRandomQuestions = (questions, count) =>
      questions
        .sort(() => Math.random() - 0.5)
        .slice(0, count);

    const selectedQuestions = [
      ...getRandomQuestions(technicalQuestions, technicalCount),
      ...getRandomQuestions(behaviorQuestions, behaviorCount),
      ...getRandomQuestions(hrQuestions, hrCount),
    ];

    // Shuffle the final combined list
    // selectedQuestions.sort(() => Math.random() - 0.5);

    return res.status(200).json({
      success: true,
      message: "Random interview questions fetched successfully",
      count: selectedQuestions.length,
      data: selectedQuestions,
    });
  } catch (error) {
    console.error("Get interview questions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch interview questions",
      error: error.message,
    });
  }
};



module.exports = {
    getQuestions,uploadInterview,getMcqQuestions,getInterviewQuestions
};