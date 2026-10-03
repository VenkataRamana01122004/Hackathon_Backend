const Manager = require("../models/Manager");
const Employee = require("../models/Employee");
const Candidate = require("../models/Candidate");
const Question = require("../models/Question");
const MCQQuestion = require("../models/MCQQuestion");
const Assessment = require("../models/Assignment")
const Bitsexam = require("../models/Bitsexam")
const Interview = require("../models/Interview");
const judgeCode = require("../middleware/judgeCode");
const InterviewQuestion = require("../models/InterviewQuestion");


const addEmployee = async (req, res) =>{
    try {

        const employee=new Employee(req.body);
        const savedEmployee = await employee.save();
        res.status(201).json(savedEmployee);
    }
    catch (err) 
    {
        res.status(500).json({ error: err.message });
    }
}

const addCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      gender: req.body.gender,
      dob: req.body.dob,
      qualification: req.body.qualification,
      experience: req.body.experience,
      skills: req.body.skills,
      appliedRole: req.body.appliedRole,
      status: req.body.status,
      resume: req.file ? req.file.filename : null,
    });

    res.status(201).json({
      message: "Candidate added successfully.",
      candidate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const viewCandidate = async(req,res)=>{
    try 
      {
        const candidatedata = await Candidate.findAll();
        if(candidatedata.length==0)
          res.status(200).send("DATA NOT FOUND");
        res.json(candidatedata);
      } 
      catch (error) 
      {
        res.status(500).send(error.message);
      }
}

const viewInterviewEligibleCandidates = async (req, res) => {
  try {
    const candidatedata = await Candidate.findAll({
      where: {
        bitsExamStatus: "Passed",
        codingExamStatus: "Passed",
      },
    });

    if (candidatedata.length === 0) {
      return res.status(200).send("DATA NOT FOUND");
    }

    return res.json(candidatedata);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const viewEmployee = async(req,res)=>{
    try 
      {
        const employeedata = await Employee.findAll();
        if(employeedata.length==0)
          res.status(200).send("DATA NOT FOUND");
        res.json(employeedata);
      } 
      catch (error) 
      {
        res.status(500).send(error.message);
      }
}

const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: question,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create question",
      error: error.message,
    });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      order: [["createdAt", "DESC"]]
      // limit: 3
    });

    return res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
    //  setTimeout(() => {
    //   return res.status(200).json({
    //     success: true,
    //     count: questions.length,
    //     data: questions,
    //   });
    // }, 2000);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
      error: error.message,
    });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByPk(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch question",
      error: error.message,
    });
  }
};

const createMcqQuestion = async (req, res) => {
  try {
    console.log(req.body);
    const {
      question,
      questionType,
      options,
      correctAnswers,
      explanation,
      difficulty,
      category,
      marks,
      negativeMarks,
      isActive,
    } = req.body;

    if (!question || !questionType || !category) {
      return res.status(400).json({
        success: false,
        message: "Question, questionType and category are required.",
      });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: "At least two options are required.",
      });
    }

    if (!Array.isArray(correctAnswers) || correctAnswers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one correct answer is required.",
      });
    }

    if (
      questionType === "SINGLE" &&
      correctAnswers.length !== 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Single choice questions must have exactly one correct answer.",
      });
    }

    // Validate correct answers exist in options
    const invalidAnswers = correctAnswers.filter(
      (answer) => !options.includes(answer)
    );

    if (invalidAnswers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Correct answers must exist in options.",
        invalidAnswers,
      });
    }

    const mcq = await MCQQuestion.create({
      question,
      questionType,
      options,
      correctAnswers,
      explanation,
      difficulty,
      category,
      marks,
      negativeMarks,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Question created successfully.",
      data: mcq,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create question.",
      error: error.message,
    });
  }
};

const getAllMcqQuestions = async (req, res) => {
  try {
    const questions = await MCQQuestion.findAll({
      order: [["createdAt", "DESC"]]
      // limit: 10,
    });

    return res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });

    //   setTimeout(() => {
    //   return res.status(200).json({
    //     success: true,
    //     count: questions.length,
    //     data: questions,
    //   });
    // }, 7000);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions.",
      error: error.message,
    });
  }
};

const getMcqQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await MCQQuestion.findByPk(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch question.",
      error: error.message,
    });
  }
};

const updateMCQ = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      question,
      questionType,
      options,
      correctAnswers,
      explanation,
      difficulty,
      category,
      marks,
      negativeMarks,
      isActive,
    } = req.body;

    const mcq = await MCQQuestion.findByPk(id);

    if (!mcq) {
      return res.status(404).json({
        success: false,
        message: "MCQ Question not found",
      });
    }

    await mcq.update({
      question,
      questionType,
      options,
      correctAnswers,
      explanation,
      difficulty,
      category,
      marks,
      negativeMarks,
      isActive,
    });

    return res.status(200).json({
      success: true,
      message: "MCQ Question updated successfully",
      data: mcq,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update MCQ Question",
      error: error.message,
    });
  }
};

const getAssessmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const assessments = await Assessment.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: assessments.length,
      data: assessments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assessments.",
      error: error.message,
    });
  }
};

const getBitsAssessmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const assessments = await Bitsexam.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: assessments.length,
      data: assessments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assessments.",
      error: error.message,
    });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByPk(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const {
      title,
      description,
      difficulty,
      category,
      constraints,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      explanation,
      starterCode,
      solutionCode,
      testCases,
      timeLimit,
      memoryLimit,
      marks,
      isActive,
    } = req.body;

    await question.update({
      title,
      description,
      difficulty,
      category,
      constraints,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      explanation,
      starterCode,
      solutionCode,
      testCases,
      timeLimit,
      memoryLimit,
      marks,
      isActive,
    });

    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: question,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update question",
      error: error.message,
    });
  }
};

const getInterviewByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const interviews = await Interview.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    if (!interviews.length) {
      return res.status(404).json({
        success: false,
        message: "No interviews found for this user.",
      });
    }


    console.log("Total Interviews:", interviews.length);

    interviews.forEach((interview, interviewIndex) => {
      console.log(`\n===== Interview ${interviewIndex + 1} =====`);
      console.log("Interview ID:", interview.id);
      console.log("User ID:", interview.userId);

      interview.answers.forEach((answer) => {
        console.log("Question No:", answer.questionNo);
        console.log("Question:", answer.question);
        console.log("Answer:", answer.answer);
        console.log("AI Score:", answer.aiScore);
        console.log("Employee Score:", answer.employeeScore);
        console.log("Explanation:", answer.explanation);
        console.log("---------------------------");
      });
    });

    return res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const scheduleInterview = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { date, time, assignedEmployeeId } = req.body;

    const candidate = await Candidate.findOne({ where: { candidateId } });

    if (!candidate) {
      return res.status(404).send("Candidate not found");
    }

    console.log(candidate);
    // Update candidate table fields
    candidate.interviewSchedule = `${date} ${time}`;
    candidate.interviewStatus = "Scheduled";
    candidate.status = "Interview Scheduled";
    candidate.assignedEmployeeId = assignedEmployeeId;

    await candidate.save();

    return res.status(200).json({ message: "Interview scheduled successfully", candidate });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


const validateCandidate_old = async (req, res) => {
  try {
    const { userId } = req.params;

    const submission = await Bitsexam.findOne({
      where: {
        userId,
      },
      order: [["createdAt", "DESC"]], // gets latest submission if multiple exist
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    const questionIds = submission.questions;

    const questions = await MCQQuestion.findAll({
      where: {
        id: questionIds,
      },
      order: [["id", "ASC"]],
    });

    let correctCount = 0;

    const result = questions.map((question) => {
      const submittedAnswer =
        submission.answers[String(question.id)] || null;

      const isCorrect =
        submittedAnswer !== null &&
        submittedAnswer === question.correctAnswer;

      if (isCorrect) {
        correctCount++;
      }

      return {
        id: question.id,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        submittedAnswer,
        status:
          submission.statuses[String(question.id)] || "not-visited",
        isCorrect,
      };
    });

    const attempted = Object.keys(submission.answers).length;

    const percentage = (correctCount / questions.length) * 100;

    const candidate = await Candidate.findByPk(userId);

      if (candidate) {
        // candidate.bitsExamStatus = percentage >= 70 ? "Passed" : "Failed";
        candidate.bitsExamStatus = "Passed";
        candidate.codingExamStatus = "Passed";
        await candidate.save();
      }

    return res.json({
      success: true,
      candidate: submission.candidateName,
      userId: submission.userId,
      totalQuestions: questions.length,
      attempted,
      correctAnswers: correctCount,
      wrongAnswers: attempted - correctCount,
      unanswered: questions.length - attempted,
      score: `${correctCount}/${questions.length}`,
      questions: result,
      violations: submission.violations,
      logs: submission.logs,
      systemInfo: submission.systemInfo,
      videoName: submission.videoName,
      submittedAt: submission.submittedAt,
    });

  } catch (err) {
    console.error("Validation Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const axios = require("axios");

const validateCandidateCoding_old = async (req, res) => {
  try {
    const { userId } = req.params;

    const submission = await Assessment.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    const results = [];
    let totalPassed = 0;
    let totalTests = 0;

    for (const answer of submission.answers || []) {
      const question = await Question.findByPk(answer.questionId);

      if (!question) continue;

      const testCases = question.testCases || [];

      // Send all test cases in ONE request per question.
      const response = await axios.post(
        "http://localhost:2004/api/compiler/run",
        {
          language: answer.language,
          code: answer.code,
          testCases: testCases.map((tc) => ({
            input: tc.input ?? "",
            expectedOutput: tc.output ?? "",
          })),
        },
        { timeout: 60000 }
      );

      const testResults = response.data.testResults || [];
      const passed = testResults.filter((test) => test.passed).length;
      const total = testCases.length;

      totalPassed += passed;
      totalTests += total;

      results.push({
        questionId: question.id,
        title: question.title,
        passed,
        failed: total - passed,
        total,
        percentage: total
          ? Number(((passed / total) * 100).toFixed(2))
          : 0,
        testResults,
      });
    }

    const overallPercentage = totalTests
      ? Number(((totalPassed / totalTests) * 100).toFixed(2))
      : 0;

    const candidate = await Candidate.findByPk(userId);

    if (candidate) {
      candidate.codingExamStatus =
        totalTests > 0 && overallPercentage >= 70
          ? "Passed"
          : "Failed";

      await candidate.save();
    }

    return res.json({
      success: true,
      candidate: submission.candidateName,
      userId,
      questions: results,
      totalPassed,
      totalTests,
      overallPercentage,
    });
  } catch (error) {
    console.error(
      "Coding validation error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to validate coding submission",
    });
  }
};

const {
  validateCoding,
  validateBits,
} = require("../middleware/candidateValidationService");


const validateCandidateCoding = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await validateCoding(userId);

    // Update candidate coding status
    const candidate = await Candidate.findByPk(userId);

    if (candidate) {
      candidate.codingExamStatus =
        result.codingStatus;

      await candidate.save();
    }

    return res.json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error(
      "Coding validation error:",
      error.response?.data ||
        error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to validate coding submission",
    });
  }
};

const validateCandidate = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await validateBits(userId);

    // Update candidate BITS status
    const candidate =
      await Candidate.findByPk(userId);

    if (candidate) {
      candidate.bitsExamStatus =
        result.percentage >= 70
          ? "Passed"
          : "Failed";

      await candidate.save();
    }

    return res.json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error(
      "BITS validation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to validate BITS submission",
    });
  }
};

const CandidateResult = require("../models/CandidateResult");

// ============================================================
// GENERATE FINAL CANDIDATE RESULT
// ============================================================
const generateCandidateResult_withoutinterview = async (req, res) => {
  try {
    const { userId } = req.params;

    const alreadyexistingResult = await CandidateResult.findOne({
      where: { userId },
    });

    if (alreadyexistingResult?.resultStatus === "COMPLETED") {
      return res.status(200).json({
        success: true,
        alreadyEvaluated: true,
        message: "Candidate has already been evaluated.",
        userId: alreadyexistingResult.userId,
        candidateName: alreadyexistingResult.candidateName,
        evaluatedAt: alreadyexistingResult.evaluatedAt,
      });
    }

    // ========================================================
    // CALL EXISTING VALIDATION LOGIC
    // ========================================================

    let codingResult;
    let bitsResult;

    try {
      codingResult = await validateCoding(userId);
    } catch (error) {
      console.log("Coding validation skipped:",error.message);

      codingResult = null;
    }

    try {
      bitsResult = await validateBits(userId);
    } catch (error) {
      console.log("BITS validation skipped:",error.message);

      bitsResult = null;
    }

    if (codingResult === null && bitsResult === null) {
      return res.status(400).json({
        success: false,
        message: "Candidate evaluation cannot proceed because both Coding and BITS submissions are unavailable.",
      });
    }

    // ========================================================
    // CODING QUESTION-WISE FINAL RESULT
    // ========================================================

    const coding = codingResult
      ? codingResult.questions.map((question) => ({
          questionId: question.questionId,

          title: question.title,

          totalTests: question.total,

          passedTests: question.passed,

          failedTests: question.failed,

          percentage: question.percentage,
        }))
      : [];

    // ========================================================
    // MCQ FINAL RESULT
    // ========================================================

    const mcq = bitsResult
      ? {
          totalQuestions:
            bitsResult.totalQuestions,

          attempted:
            bitsResult.attempted,

          correctAnswers:
            bitsResult.correctAnswers,

          wrongAnswers:
            bitsResult.wrongAnswers,

          unanswered:
            bitsResult.unanswered,

          percentage:
            bitsResult.percentage,
        }
      : {
          totalQuestions: 0,
          attempted: 0,
          correctAnswers: 0,
          wrongAnswers: 0,
          unanswered: 0,
          percentage: 0,
        };

    // ========================================================
    // SECURITY INFORMATION FROM BITS
    // ========================================================

    const security = bitsResult
      ? {
          tabSwitches: Number(
            bitsResult.violations?.tabSwitches || 0
          ),

          fullscreenExits: Number(
            bitsResult.violations?.fullscreenExits || 0
          ),

          isBlurred: Boolean(
            bitsResult.violations?.isBlurred
          ),

          isOffline: Boolean(
            bitsResult.violations?.isOffline
          ),
        }
      : {
          tabSwitches: 0,
          fullscreenExits: 0,
          isBlurred: false,
          isOffline: false,
        };

    // ========================================================
    // CODING OVERALL PERCENTAGE
    // ========================================================

    const codingPercentage =
      codingResult?.overallPercentage || 0;

    // ========================================================
    // BITS OVERALL PERCENTAGE
    // ========================================================

    const mcqPercentage =
      bitsResult?.percentage || 0;

    // ========================================================
    // OVERALL SCORE
    // ========================================================
    //
    // Change these weights according to your project.
    //
    // Example:
    // Coding     = 40%
    // BITS       = 30%
    // Interview  = 30%
    //
    // Interview is not included yet because you haven't
    // supplied an interview validation function.
    // ========================================================

    const overallPercentage = Number(
      (
        codingPercentage * 0.4 +
        mcqPercentage * 0.3
      ).toFixed(2)
    );

    // ========================================================
    // CANDIDATE NAME
    // ========================================================

    const candidateName =
      codingResult?.candidate ||
      bitsResult?.candidate ||
      "Unknown Candidate";

    // ========================================================
    // FINAL RESULT OBJECT
    // ========================================================

    const finalResult = {
      userId,

      candidateName,

      coding,

      mcq,

      interview: {},

      security,

      overallPercentage,

      overallScore: overallPercentage,

      resultStatus: "COMPLETED",

      evaluatedAt: new Date(),
    };

    // ========================================================
    // CREATE OR UPDATE FINAL RESULT
    // ========================================================

    const existingResult =
      await CandidateResult.findOne({
        where: {
          userId,
        },
      });

    let savedResult;

    if (existingResult) {
      await existingResult.update(
        finalResult
      );

      savedResult = existingResult;
    } else {
      savedResult =
        await CandidateResult.create(
          finalResult
        );
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(200).json({
      success: true,

      message:
        "Final candidate result generated successfully",

      result: savedResult,
    });

  } catch (error) {
    console.error(
      "Final result generation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate candidate final result",
      error: error.message,
    });
  }
};

const { evaluateInterviewAnswers } = require("../controllers/gptModel");

const generateCandidateResult = async (req, res) => {
  try {
    const { userId } = req.params;

    // ========================================================
    // 1. CHECK EXISTING RESULT
    // ========================================================

    const existingResult = await CandidateResult.findOne({
      where: { userId },
    });

    if (existingResult?.resultStatus === "COMPLETED") {
      return res.status(200).json({
        success: true,
        alreadyEvaluated: true,
        message: "Candidate has already been evaluated.",
        result: existingResult,
      });
    }

    // ========================================================
    // 2. VALIDATE CODING AND BITS SUBMISSIONS
    // ========================================================

    let codingResult = null;
    let bitsResult = null;

    try {
      codingResult = await validateCoding(userId);
    } catch (error) {
      console.log("Coding validation skipped:", error.message);
    }

    try {
      bitsResult = await validateBits(userId);
    } catch (error) {
      console.log("BITS validation skipped:", error.message);
    }

    if (!codingResult && !bitsResult) {
      return res.status(400).json({
        success: false,
        message:
          "Evaluation cannot proceed because both Coding and BITS submissions are unavailable.",
      });
    }

    // ========================================================
    // 3. CODING QUESTION-WISE RESULTS
    // ========================================================

    const coding = (codingResult?.questions || []).map((question) => ({
      questionId: question.questionId,
      title: question.title,
      totalTests: question.total,
      passedTests: question.passed,
      failedTests: question.failed,
      percentage: Number(question.percentage || 0),
    }));

    const codingPercentage = Number(
      codingResult?.overallPercentage || 0
    );

    // ========================================================
    // 4. MCQ / BITS RESULTS
    // ========================================================

    const mcqPercentage = Number(bitsResult?.percentage || 0);

    const mcq = {
      totalQuestions: Number(bitsResult?.totalQuestions || 0),
      attempted: Number(bitsResult?.attempted || 0),
      correctAnswers: Number(bitsResult?.correctAnswers || 0),
      wrongAnswers: Number(bitsResult?.wrongAnswers || 0),
      unanswered: Number(bitsResult?.unanswered || 0),
      percentage: mcqPercentage,
    };

    // Set true for AI evaluation, false for default 5 marks per answer
const USE_AI_EVALUATION = false;

// ========================================================
// 5. INTERVIEW SCORE - AI OR DEFAULT EVALUATION
// ========================================================

const interviewSubmission = await Interview.findOne({
  where: { userId },
  order: [["createdAt", "DESC"]],
});

let interview = {
  totalQuestions: 0,
  score: 0,
  totalMarks: 0,
  percentage: 0,
  answers: [],
};

if (interviewSubmission) {
  const answers = Array.isArray(interviewSubmission.answers)
    ? interviewSubmission.answers
    : [];

  let scoredAnswers = [];

  if (USE_AI_EVALUATION) {
    // AI evaluates each candidate's answer out of 10
    scoredAnswers = await evaluateInterviewAnswers(answers);
  } else {
    // Default: assign 5 marks out of 10 per answer
    scoredAnswers = answers.map((answer) => ({
      ...answer,
      aiScore: 5,
      explanation: answer.explanation || "Default score assigned.",
    }));
  }

  // Calculate total score
  const totalScore = scoredAnswers.reduce(
    (sum, answer) => sum + answer.aiScore,
    0
  );

  const totalMarks = scoredAnswers.length * 10;

  const percentage =
    totalMarks > 0
      ? Number(((totalScore / totalMarks) * 100).toFixed(2))
      : 0;

  // Save scores and explanations in the database
  await interviewSubmission.update({
    answers: scoredAnswers,
  });

  interview = {
    totalQuestions: scoredAnswers.length,
    score: totalScore,
    totalMarks,
    percentage,
    answers: scoredAnswers,
  };
}


// const interviewSubmission = await Interview.findOne({
//   where: { userId },
//   order: [["createdAt", "DESC"]],
// });

// let interview = {
//   totalQuestions: 0,
//   score: 0,
//   totalMarks: 0,
//   percentage: 0,
//   answers: [],
// };

// if (interviewSubmission) {
//   // Send all candidate questions and answers to the AI.
//   const scoredAnswers = await evaluateInterviewAnswers(
//     interviewSubmission.answers
//   );

//   // Calculate total score.
//   const totalScore = scoredAnswers.reduce(
//     (sum, answer) => sum + answer.aiScore,
//     0
//   );

//   const totalMarks = scoredAnswers.length * 10;

//   const percentage =
//     totalMarks > 0
//       ? Number(((totalScore / totalMarks) * 100).toFixed(2))
//       : 0;

//   // Save AI scores and explanations to the database.
//   await interviewSubmission.update({
//     answers: scoredAnswers,
//   });

//   interview = {
//     totalQuestions: scoredAnswers.length,
//     score: totalScore,
//     totalMarks,
//     percentage,
//     answers: scoredAnswers,
//   };
// }

    // ========================================================
    // 6. SECURITY INFORMATION
    // ========================================================

    const violations = bitsResult?.violations || {};

    const security = {
      tabSwitches: Number(violations.tabSwitches || 0),
      fullscreenExits: Number(violations.fullscreenExits || 0),
      isBlurred: Boolean(violations.isBlurred),
      isOffline: Boolean(violations.isOffline),
    };

    // ========================================================
    // 7. OVERALL SCORE
    // Coding   = 40%
    // BITS     = 30%
    // Interview = 30%
    // ========================================================

    const overallPercentage = Number(
      (
        codingPercentage * 0.4 +
        mcqPercentage * 0.3 +
        interview.percentage * 0.3
      ).toFixed(2)
    );

    // ========================================================
    // 8. CANDIDATE NAME
    // ========================================================

    const candidateName =
      codingResult?.candidate ||
      bitsResult?.candidate ||
      "Unknown Candidate";

    // ========================================================
    // 9. BUILD FINAL RESULT
    // ========================================================

    const finalResult = {
      userId,
      candidateName,
      coding,
      mcq,
      interview,
      security,
      overallPercentage,
      overallScore: overallPercentage,
      resultStatus: "COMPLETED",
      evaluatedAt: new Date(),
    };

    // ========================================================
    // 10. CREATE OR UPDATE RESULT
    // ========================================================

    let savedResult;

    if (existingResult) {
      await existingResult.update(finalResult);
      savedResult = existingResult;
    } else {
      savedResult = await CandidateResult.create(finalResult);
    }

    // ========================================================
    // 11. RESPONSE
    // ========================================================

    return res.status(200).json({
      success: true,
      alreadyEvaluated: false,
      message: "Final candidate result generated successfully.",
      result: savedResult,
    });
  } catch (error) {
    console.error("Final result generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate candidate final result.",
      error: error.message,
    });
  }
};

const getCandidateResult = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await CandidateResult.findOne({
      where: { userId },
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Candidate result not found",
      });
    }

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Get candidate result error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get candidate result",
      error: error.message,
    });
  }
};

const addInterviewQuestion = async (req, res) => {
  try {
    const {
      question,
      expectedAnswer,
      category,
      difficulty,
      questionType,
      marks,
      isActive,
    } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const validDifficulties = ["Easy", "Medium", "Hard"];
    const validTypes = ["Technical", "HR", "Behavioral"];

    if (
      difficulty &&
      !validDifficulties.includes(difficulty)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty",
      });
    }

    if (
      questionType &&
      !validTypes.includes(questionType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid question type",
      });
    }

    const newQuestion = await InterviewQuestion.create({
      question: question.trim(),
      expectedAnswer,
      category,
      difficulty,
      questionType,
      marks,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Interview question added successfully",
      data: newQuestion,
    });
  } catch (error) {
    console.error("Add interview question error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add interview question",
      error: error.message,
    });
  }
};


const getAllInterviewQuestions = async (req, res) => {
  try {
    const questions = await InterviewQuestion.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Interview questions fetched successfully",
      count: questions.length,
      data: questions,
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


const { generateInterviewQuestions } = require("../controllers/gptModel");


const generateAndSaveInterviewQuestions = async (req, res) => {
  try {
    const { topic, category, count } = req.body;

    // Validate request
    if (!topic || !category || count == null) {
      return res.status(400).json({
        success: false,
        message: "topic, category, and count are required",
      });
    }

    const numberOfQuestions = Number(count);

    if (
      !Number.isInteger(numberOfQuestions) ||
      numberOfQuestions < 1 ||
      numberOfQuestions > 20
    ) {
      return res.status(400).json({
        success: false,
        message: "count must be an integer between 1 and 20",
      });
    }

    const validDifficulties = ["Easy", "Medium", "Hard"];

    if (!validDifficulties.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "category must be Easy, Medium, or Hard",
      });
    }

    // Generate interview questions using Groq
    const questions = await generateInterviewQuestions(
      topic,
      category,
      numberOfQuestions
    );

    // Prepare data for database
    const questionData = questions.map((q) => ({
      question: q.question,
      expectedAnswer: q.expectedAnswer,
      category: topic,
      difficulty: category,
      questionType: q.questionType,
      marks: 10,
      isActive: true,
    }));

    // Save generated questions to database
    const savedQuestions = await InterviewQuestion.bulkCreate(
      questionData,
      {
        validate: true,
      }
    );

    return res.status(201).json({
      success: true,
      message: "Interview questions generated and saved successfully",
      count: savedQuestions.length,
      data: savedQuestions,
    });
  } catch (error) {
    console.error("Generate and save interview questions:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate and save interview questions",
      error: error.message,
    });
  }
};

module.exports = {
    addEmployee,addCandidate,viewCandidate,viewEmployee,createQuestion,
    getAllQuestions,getQuestionById,createMcqQuestion,getAllMcqQuestions,
    getMcqQuestionById,getAssessmentsByUserId,getBitsAssessmentsByUserId,
    updateMCQ,updateQuestion,getInterviewByUserId,viewInterviewEligibleCandidates,
    scheduleInterview,validateCandidate,validateCandidateCoding,generateCandidateResult,
    getCandidateResult,addInterviewQuestion,getAllInterviewQuestions,generateAndSaveInterviewQuestions
};