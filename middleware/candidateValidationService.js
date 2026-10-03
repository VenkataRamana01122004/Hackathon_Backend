// services/candidateValidationService.js

const axios = require("axios");

const Assessment = require("../models/Assignment");
const Question = require("../models/Question");
const Bitsexam = require("../models/Bitsexam");
const MCQQuestion = require("../models/MCQQuestion");


// ============================================================
// CODING VALIDATION
// ============================================================
const validateCoding = async (userId) => {
  const submission = await Assessment.findOne({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });

  if (!submission) {
    throw new Error("Coding submission not found");
  }

  const results = [];

  let totalPassed = 0;
  let totalTests = 0;

  for (const answer of submission.answers || []) {
    const question = await Question.findByPk(answer.questionId);

    if (!question) continue;

    const testCases = question.testCases || [];

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
      {
        timeout: 60000,
      }
    );

    const testResults = response.data.testResults || [];

    const passed = testResults.filter(
      (test) => test.passed
    ).length;

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

      // Keep detailed results available for validation response.
      testResults,
    });
  }

  const overallPercentage = totalTests
    ? Number(
        ((totalPassed / totalTests) * 100).toFixed(2)
      )
    : 0;

  return {
    candidate: submission.candidateName,
    userId,

    questions: results,

    totalPassed,
    totalTests,

    overallPercentage,

    codingStatus:
      totalTests > 0 && overallPercentage >= 70
        ? "Passed"
        : "Failed",
  };
};


// ============================================================
// MCQ / BITS VALIDATION
// ============================================================
const validateBits = async (userId) => {
  const submission = await Bitsexam.findOne({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });

  if (!submission) {
    throw new Error("BITS submission not found");
  }

  const questionIds = submission.questions || [];

  const questions = await MCQQuestion.findAll({
    where: { id: questionIds },
  });

  // Preserve the original question order from the submission.
  const questionMap = new Map(
    questions.map((question) => [
      Number(question.id),
      question,
    ])
  );

  const orderedQuestions = questionIds
    .map((id) => questionMap.get(Number(id)))
    .filter(Boolean);

  let correctCount = 0;
  let attempted = 0;

  const result = orderedQuestions.map((question) => {
    const questionId = String(question.id);

    const rawAnswer = submission.answers?.[questionId];
    const submittedAnswer =
      rawAnswer === undefined || rawAnswer === null
        ? null
        : rawAnswer;

    const hasAnswer =
      submittedAnswer !== null &&
      submittedAnswer !== "" &&
      (!Array.isArray(submittedAnswer) ||
        submittedAnswer.length > 0);

    if (hasAnswer) {
      attempted++;
    }

    // Normalize both answers to arrays of strings.
    const normalize = (value) => {
      const values = Array.isArray(value) ? value : [value];

      return values
        .filter((item) => item !== null && item !== undefined)
        .map((item) => String(item).trim())
        .sort();
    };

    const correctAnswers = normalize(
      question.correctAnswers || []
    );

    const candidateAnswers = hasAnswer
      ? normalize(submittedAnswer)
      : [];

    const isCorrect =
      hasAnswer &&
      correctAnswers.length > 0 &&
      candidateAnswers.length === correctAnswers.length &&
      candidateAnswers.every(
        (answer, index) => answer === correctAnswers[index]
      );

    if (isCorrect) {
      correctCount++;
    }

    return {
      id: question.id,
      question: question.question,
      questionType: question.questionType,
      options: question.options,
      correctAnswers: question.correctAnswers,
      submittedAnswer,
      status:
        submission.statuses?.[questionId] ||
        (hasAnswer ? "answered" : "not-visited"),
      isCorrect,
    };
  });

  const totalQuestions = orderedQuestions.length;
  const unanswered = totalQuestions - attempted;
  const wrongAnswers = attempted - correctCount;

  const percentage =
    totalQuestions > 0
      ? Number(
          ((correctCount / totalQuestions) * 100).toFixed(2)
        )
      : 0;

  return {
    candidate: submission.candidateName,
    userId,
    totalQuestions,
    attempted,
    correctAnswers: correctCount,
    wrongAnswers,
    unanswered,
    score: `${correctCount}/${totalQuestions}`,
    percentage,
    questions: result,
    violations: submission.violations,
    logs: submission.logs,
    systemInfo: submission.systemInfo,
    videoName: submission.videoName,
    submittedAt: submission.submittedAt,
  };
};

module.exports = {
  validateCoding,
  validateBits,
};