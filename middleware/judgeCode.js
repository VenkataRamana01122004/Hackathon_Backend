const axios = require("axios");

const judgeCode = async ({ language, code, input, expectedOutput }) => {
  try {
    const response = await axios.post(
      "http://localhost:2004/api/compiler/run",
      {
        language,
        code,
        input: input ?? "",
      },
      {
        timeout: 15000,
      }
    );

    const data = response.data;

    // Adapt this check if your compiler API uses a different response format.
    if (data.success === false) {
      return {
        passed: false,
        output: data.stderr || data.output || data.message || "Execution failed",
      };
    }

    const actualOutput = String(
      data.output ?? data.stdout ?? ""
    ).trim();

    const expected = String(expectedOutput ?? "").trim();

    return {
      passed: actualOutput === expected,
      output: actualOutput,
    };
  } catch (error) {
    return {
      passed: false,
      output: error.response?.data?.message ||
        error.response?.data?.stderr ||
        error.message ||
        "Compiler API request failed",
    };
  }
};

module.exports = judgeCode;