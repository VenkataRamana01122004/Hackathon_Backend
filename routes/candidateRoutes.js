const express = require("express");
const router = express.Router();
const { uploadInterview } = require("../controllers/candidateController");

router.post("/upload", uploadInterview);

router.post("/background-process", (req, res) => {
  console.log("Candidate:", req.body.candidateId);

  console.log("Running Processes:");
  console.log(req.body.processes);

  res.json({
    success: true,
  });
});



module.exports = router;