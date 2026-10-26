const express = require("express");
const router = express.Router();
const { uploadInterview } = require("../controllers/candidateController");
const candidatecontroller = require("../controllers/candidateController");

router.post("/upload", uploadInterview);

// router.post("/background-process", async (req, res) => {
//   try {
//     const {
//       candidateId,
//       backgroundApplications,
//       fullscreenExits,
//       tabSwitches,
//       isBlurred,
//       isOffline,
//       securityPassed,
//       securityLogs
//     } = req.body;

//     console.log("Candidate:", candidateId);

//     const applications = backgroundApplications;
//     const uniqueNames = [
//   ...new Set(applications.map(app => app.name))
// ];

// console.log(uniqueNames);
//     // console.log("Running Processes:", backgroundApplications);

//     res.status(200).json({
//       success: true,
//       message: "Security check received",
//       backgroundApplications
//     });

//   } catch (error) {
//     console.error("Security check error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// });

const CandidateProcessLog = require("../models/CandidateProcessLog");

router.post("/background-process", async (req, res) => {
  try {
    const { candidateId, backgroundApplications = [] } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "candidateId is required",
      });
    }

    if (!Array.isArray(backgroundApplications)) {
      return res.status(400).json({
        success: false,
        message: "backgroundApplications must be an array",
      });
    }

    // Extract unique process names.
    const uniqueNames = [
      ...new Set(
        backgroundApplications
          .map((app) => (typeof app === "string" ? app : app?.name))
          .filter(Boolean)
      ),
    ];

    // Save only the three required fields.
    const savedLog = await CandidateProcessLog.create({
      candidateId,
      processes: uniqueNames,
      processCount: uniqueNames.length,
    });

    console.log("Candidate:", candidateId);
    console.log("Process count:", uniqueNames.length);

    return res.status(201).json({
      success: true,
      message: "Background processes saved successfully",
      data: savedLog,
    });
  } catch (error) {
    console.error("Background process save error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


router.get("/getquestions", candidatecontroller.getQuestions);
router.get("/getMcqQuestions",candidatecontroller.getMcqQuestions);
router.get("/getInterviewQuestions",candidatecontroller.getInterviewQuestions);



module.exports = router;