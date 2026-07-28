const express = require("express");
const router = express.Router();

const managercontroller = require("../controllers/managerController");
const upload = require("../middleware/uploadResume");


router.post("/addemployee", managercontroller.addEmployee);
router.post("/addcandidate",upload.single("resume"),managercontroller.addCandidate);

router.get("/viewemployee", managercontroller.viewEmployee);
router.get("/viewcandidate", managercontroller.viewCandidate);
router.get("/viewintervieweligiblecandidates", managercontroller.viewInterviewEligibleCandidates);

router.post("/addquestion", managercontroller.createQuestion);
router.get("/allquestions", managercontroller.getAllQuestions);
router.get("/questionbyid/:id", managercontroller.getQuestionById);
router.put("/updatequestion/:id", managercontroller.updateQuestion);


router.post("/createmcq", managercontroller.createMcqQuestion);
router.get("/getallmcqs", managercontroller.getAllMcqQuestions);
router.get("/getmcqbyid/:id", managercontroller.getMcqQuestionById);
router.put("/updatemcq/:id", managercontroller.updateMCQ);


router.get("/getAssessmentsByUserId/:userId", managercontroller.getAssessmentsByUserId);
router.get("/getBitsAssessmentsByUserId/:userId", managercontroller.getBitsAssessmentsByUserId);

router.get("/getInterviewDetailsByUserId/:userId", managercontroller.getInterviewByUserId);

router.put("/schedule/:candidateId", managercontroller.scheduleInterview);

module.exports = router;