const Manager = require("../models/Manager");
const Employee = require("../models/Employee");
const Candidate = require("../models/Candidate");
const Question = require("../models/Question");
const MCQQuestion = require("../models/MCQQuestion");
const Assessment = require("../models/Assignment")
const Bitsexam = require("../models/Bitsexam")
const Interview = require("../models/Interview");
const judgeCode = require("../middleware/judgeCode");


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


const validateCandidate = async (req, res) => {
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

const validateCandidateCoding = async (req, res) => {
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

    for (const answer of submission.answers) {
        const question = await Question.findByPk(answer.questionId);

        let passed = 0;

        for (const testCase of question.testCases) {

           const result = await judgeCode({
              language: answer.language,
              code: answer.code,
              input: testCase.input,
              expectedOutput: testCase.output,
            });

            if (result.passed) {
              passed++;
            }
        }

        const total = question.testCases.length;

        totalPassed += passed;
        totalTests += total;

        results.push({
            questionId: question.id,
            title: question.title,
            passed,
            failed: total - passed,
            total,
            percentage: Number(((passed / total) * 100).toFixed(2)),
        });
    }

    const overallPercentage = Number(
        ((totalPassed / totalTests) * 100).toFixed(2)
    );

    const candidate = await Candidate.findByPk(userId);

    if (candidate) {
        candidate.codingExamStatus =
            overallPercentage >= 70 ? "Passed" : "Failed";
        await candidate.save();
    }

    return res.json({
        success: true,
        candidate: submission.candidateName,
        userId,
        questions: results,
        overallPercentage,
    });
};

module.exports = {
    addEmployee,addCandidate,viewCandidate,viewEmployee,createQuestion,
    getAllQuestions,getQuestionById,createMcqQuestion,getAllMcqQuestions,
    getMcqQuestionById,getAssessmentsByUserId,getBitsAssessmentsByUserId,
    updateMCQ,updateQuestion,getInterviewByUserId,viewInterviewEligibleCandidates,
    scheduleInterview,validateCandidate,validateCandidateCoding
};