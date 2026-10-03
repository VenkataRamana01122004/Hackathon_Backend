const express = require("express");
const router = express.Router();
const { uploadInterview } = require("../controllers/candidateController");
const candidatecontroller = require("../controllers/candidateController");

router.post("/upload", uploadInterview);

// router.post("/background-process", (req, res) => {
//   console.log("Candidate:", req.body.candidateId);

//   console.log("Running Processes:");
//   console.log(req.body.processes);

//   res.json({
//     success: true,
//   });
// });

router.post("/background-process", async (req, res) => {
  try {
    const {
      candidateId,
      backgroundApplications,
      fullscreenExits,
      tabSwitches,
      isBlurred,
      isOffline,
      securityPassed,
      securityLogs
    } = req.body;

    console.log("Candidate:", candidateId);

    const applications = backgroundApplications;
    const uniqueNames = [
  ...new Set(applications.map(app => app.name))
];

console.log(uniqueNames);
    // console.log("Running Processes:", backgroundApplications);

    res.status(200).json({
      success: true,
      message: "Security check received",
      backgroundApplications
    });

  } catch (error) {
    console.error("Security check error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
router.get("/getquestions", candidatecontroller.getQuestions);
router.get("/getMcqQuestions",candidatecontroller.getMcqQuestions);
router.get("/getInterviewQuestions",candidatecontroller.getInterviewQuestions);



module.exports = router;