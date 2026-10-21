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

// const getQuestions = async (req, res) => {
//   try {
//     const questions = await Question.findAll({
//       order: [["createdAt", "DESC"]],
//       limit: 3
//     });
//      setTimeout(() => {
//       return res.status(200).json({
//         success: true,
//         count: questions.length,
//         data: questions,
//       });
//     }, 2000);
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch questions",
//       error: error.message,
//     });
//   }
// };


// const getQuestions = async (req, res) => {
//   try {
//     const [easyQuestion, mediumQuestion, hardQuestion] =
//       await Promise.all([
//         Question.findOne({
//           where: {
//             difficulty: "Easy",
//             isActive: true,
//           },
//           order: Sequelize.literal("RAND()"),
//         }),

//         Question.findOne({
//           where: {
//             difficulty: "Medium",
//             isActive: true,
//           },
//           order: Sequelize.literal("RAND()"),
//         }),

//         Question.findOne({
//           where: {
//             difficulty: "Hard",
//             isActive: true,
//           },
//           order: Sequelize.literal("RAND()"),
//         }),
//       ]);

//     const questions = [
//       easyQuestion,
//       mediumQuestion,
//       hardQuestion,
//     ].filter(Boolean);

//     // Randomize the order of the returned questions
//     for (let i = questions.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [questions[i], questions[j]] = [questions[j], questions[i]];
//     }

//     setTimeout(() => {
//       return res.status(200).json({
//         success: true,
//         count: questions.length,
//         data: questions,
//       });
//     }, 2000);

//   } catch (error) {
//     console.error("Error fetching random questions:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch questions",
//       error: error.message,
//     });
//   }
// };

const { Op } = require("sequelize");

const getQuestions = async (req, res) => {
  const { candidate_id } = req.query;

  try {
    if (!candidate_id) {
      return res.status(400).json({
        success: false,
        message: "candidate_id is required.",
      });
    }

    // Find candidate using the database primary key
    const candidate = await Candidate.findByPk(candidate_id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    let questions = [];

    if (candidate.isRandomSchedule === true) {
      // Fetch coding questions assigned to this candidate
      const assignedIds = candidate.coding_question_ids || [];

      if (!Array.isArray(assignedIds) || assignedIds.length === 0) {
        return res.status(200).json({
          success: true,
          count: 0,
          data: [],
          message: "No coding questions assigned to this candidate.",
        });
      }

      const assignedQuestions = await Question.findAll({
        where: {
          id: {
            [Op.in]: assignedIds,
          },
          isActive: true,
        },
      });

      // Preserve the order of assigned question IDs
      const questionsById = new Map(
        assignedQuestions.map((question) => [
          Number(question.id),
          question,
        ])
      );

      questions = assignedIds
        .map((id) => questionsById.get(Number(id)))
        .filter(Boolean);
    } 
    
    else {
  const isHigherGrade = [10, 11, 12, 13].includes(Number(candidate.grade));

  let questionPromises;

  if (isHigherGrade) {
    // Grades 11, 12, 13: two Medium and one Hard
    questionPromises = [
      Question.findOne({
        where: {
          difficulty: "Medium",
          isActive: true,
        },
        order: Sequelize.literal("RAND()"),
      }),

      Question.findOne({
        where: {
          difficulty: "Medium",
          isActive: true,
        },
        order: Sequelize.literal("RAND()"),
      }),

      Question.findOne({
        where: {
          difficulty: "Hard",
          isActive: true,
        },
        order: Sequelize.literal("RAND()"),
      }),
    ];
  } else {
    // Other grades: one Easy, one Medium, and one Hard
    questionPromises = [
      Question.findOne({
        where: {
          difficulty: "Easy",
          isActive: true,
        },
        order: Sequelize.literal("RAND()"),
      }),

      Question.findOne({
        where: {
          difficulty: "Medium",
          isActive: true,
        },
        order: Sequelize.literal("RAND()"),
      }),

      Question.findOne({
        where: {
          difficulty: "Hard",
          isActive: true,
        },
        order: Sequelize.literal("RAND()"),
      }),
    ];
  }

  questions = (await Promise.all(questionPromises)).filter(Boolean);

  // Shuffle the returned questions
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [
      questions[j],
      questions[i],
    ];
  }
}

    // else {
    //   // Existing random selection: one Easy, one Medium, one Hard
    //   const [easyQuestion, mediumQuestion, hardQuestion] =
    //     await Promise.all([
    //       Question.findOne({
    //         where: {
    //           difficulty: "Easy",
    //           isActive: true,
    //         },
    //         order: Sequelize.literal("RAND()"),
    //       }),

    //       Question.findOne({
    //         where: {
    //           difficulty: "Medium",
    //           isActive: true,
    //         },
    //         order: Sequelize.literal("RAND()"),
    //       }),

    //       Question.findOne({
    //         where: {
    //           difficulty: "Hard",
    //           isActive: true,
    //         },
    //         order: Sequelize.literal("RAND()"),
    //       }),
    //     ]);

    //   questions = [
    //     easyQuestion,
    //     mediumQuestion,
    //     hardQuestion,
    //   ].filter(Boolean);

    //   // Shuffle the returned questions
    //   for (let i = questions.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [questions[i], questions[j]] = [
    //       questions[j],
    //       questions[i],
    //     ];
    //   }
    // }

    
    setTimeout(() => {
      return res.status(200).json({
        success: true,
        count: questions.length,
        data: questions,
      });
    }, 1000);
  } catch (error) {
    console.error("Error fetching coding questions:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions.",
      error: error.message,
    });
  }
};

// const getMcqQuestions = async (req, res) => {
//   const { candidate_id } = req.query;
//   console.log(candidate_id)
//   try {
//     // 10 random AI questions
//     const aiQuestions = await MCQQuestion.findAll({
//       where: { category: "AI" },
//       order: Sequelize.literal("RAND()"),
//       limit: 10,
//     });

//     // 1 random SQL question
//     const sqlQuestions = await MCQQuestion.findAll({
//       where: { category: "SQL" },
//       order: Sequelize.literal("RAND()"),
//       limit: 1,
//     });

//     // 4 random questions from categories other than AI and SQL
//     const coreQuestions = await MCQQuestion.findAll({
//       where: {
//         category: {
//           [Op.notIn]: ["AI", "SQL"],
//         },
//       },
//       order: Sequelize.literal("RAND()"),
//       limit: 4,
//     });

//     // Combine and shuffle
//     const questions = [
//       ...aiQuestions,
//       ...sqlQuestions,
//       ...coreQuestions,
//     ].sort(() => Math.random() - 0.5);

//     return res.status(200).json({
//       success: true,
//       count: questions.length,
//       data: questions,
//     });
//   } catch (error) {
//     console.error("Failed to fetch MCQ questions:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch questions.",
//       error: error.message,
//     });
//   }
// };

const getMcqQuestions = async (req, res) => {
  const { candidate_id } = req.query;

  try {
    if (!candidate_id) {
      return res.status(400).json({
        success: false,
        message: "candidate_id is required.",
      });
    }

    // Find candidate by database primary key
    const candidate = await Candidate.findByPk(candidate_id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    let questions = [];

    if (candidate.isRandomSchedule === true) {
      // Use the questions assigned to this candidate
      const assignedIds = candidate.bits_question_ids || [];

      if (!Array.isArray(assignedIds) || assignedIds.length === 0) {
        return res.status(200).json({
          success: true,
          count: 0,
          data: [],
          message: "No MCQ questions have been assigned to this candidate.",
        });
      }

      // Fetch assigned questions in the order of their assigned IDs
      const assignedQuestions = await MCQQuestion.findAll({
        where: {
          id: {
            [Op.in]: assignedIds,
          },
        },
      });

      const questionsById = new Map(
        assignedQuestions.map((question) => [
          Number(question.id),
          question,
        ])
      );

      questions = assignedIds
        .map((id) => questionsById.get(Number(id)))
        .filter(Boolean);
    } else {
      // Existing random schedule: 10 AI questions
      const aiQuestions = await MCQQuestion.findAll({
        where: { category: "AI" },
        order: Sequelize.literal("RAND()"),
        limit: 10,
      });

      // 1 random SQL question
      const sqlQuestions = await MCQQuestion.findAll({
        where: { category: "SQL" },
        order: Sequelize.literal("RAND()"),
        limit: 1,
      });

      // 4 random questions excluding AI and SQL
      const coreQuestions = await MCQQuestion.findAll({
        where: {
          category: {
            [Op.notIn]: ["AI", "SQL"],
          },
        },
        order: Sequelize.literal("RAND()"),
        limit: 4,
      });

      // Combine and shuffle
      questions = [
        ...aiQuestions,
        ...sqlQuestions,
        ...coreQuestions,
      ].sort(() => Math.random() - 0.5);
    }

    return res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    console.error("Failed to fetch MCQ questions:", error);

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