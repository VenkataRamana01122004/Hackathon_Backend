const token="";

const ModelClient = require("@azure-rest/ai-inference").default;
const { isUnexpected } = require("@azure-rest/ai-inference");
const { AzureKeyCredential } = require("@azure/core-auth");

const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1-mini";


async function generateMCQs(topic, category, count) {
  const client = ModelClient(
    endpoint,
    new AzureKeyCredential(token)
  );

  const response = await client.path("/chat/completions").post({
    body: {
      model,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: `
You are an expert MCQ generator.

Return ONLY a valid JSON array.

Each object must follow exactly this format:

{
  "question": "Question text",
  "questionType": "SINGLE",
  "options": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  "correctAnswers": [
    "Option A"
  ],
  "difficulty": "Easy",
  "category": "${category}",
  "marks": 1,
  "negativeMarks": 0,
  "isActive": true
}

Rules:
1. Output ONLY JSON.
2. No markdown.
3. No explanation.
4. Exactly 4 options.
5. correctAnswers must match one of the options exactly.
6. Mix Easy, Medium and Hard questions.
7. questionType should always be "SINGLE".
`
        },
        {
          role: "user",
          content: `Generate ${count} multiple choice questions on "${topic}".`
        }
      ]
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  return JSON.parse(response.body.choices[0].message.content);
}

async function generateCodingQuestions(topic, category, count = 3) {
  const client = ModelClient(
    endpoint,
    new AzureKeyCredential(token)
  );

  const response = await client.path("/chat/completions").post({
    body: {
      model,
      temperature: 0.7,
      messages: [
        {
  role: "system",
  content: `
You are an expert coding challenge creator.

Generate programming problems suitable for an online coding assessment.

Return ONLY a valid JSON array.

Each object MUST exactly follow this schema:

{
  "title": "",
  "description": "",
  "difficulty": "Easy",
  "category": "",
  "constraints": "",
  "inputFormat": "",
  "outputFormat": "",
  "sampleInput": "",
  "sampleOutput": "",
  "explanation": "",
  "starterCode": {
    "javascript": "",
    "java": "",
    "python": "",
    "cpp": ""
  },
  "solutionCode": {
    "javascript": "",
    "java": "",
    "python": "",
    "cpp": ""
  },
  "testCases": [
    {
      "input": "",
      "output": "",
      "hidden": false
    }
  ],
  "timeLimit": 2,
  "memoryLimit": 256,
  "marks": 100,
  "isActive": true
}

Rules:

1. Return ONLY JSON.
2. Do NOT return markdown.
3. Do NOT include explanations outside JSON.
4. Problems must be complete coding challenges, not MCQs or theory questions.
5. Every problem must have a unique title.
6. Description must clearly explain the task.
7. Include realistic constraints.
8. Include input and output formats.
9. Include sample input and sample output.
10. Include an explanation for the sample.
11. Generate starter code in JavaScript, Java, Python, and C++.
12. Generate fully correct solution code in all four languages.
13. Include at least 8 test cases.
14. At least 3 test cases must have hidden=true.
15. Solution must pass every test case.
16. Mix Easy, Medium and Hard problems.
17. Category must match the requested category exactly.
18. timeLimit = 2
19. memoryLimit = 256
20. marks = 100
21. isActive = true

The generated problems should be similar in quality to coding assessment platforms such as LeetCode, HackerRank, Codeforces, and CodeChef.
`
},{
  role: "user",
  content: `Generate ${count} coding round problems for the topic "${topic}" in the "${category}" category. The problems should test programming and problem-solving skills suitable for an online coding assessment.`
}
      ]
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  return JSON.parse(response.body.choices[0].message.content);
}

module.exports = {
  generateMCQs,generateCodingQuestions
};