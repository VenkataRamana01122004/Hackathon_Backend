const express = require("express");
const router = express.Router();

const managercontroller = require("../controllers/managerController");

router.post("/addemployee", managercontroller.addEmployee);
router.post("/addcandidate", managercontroller.addCandidate);

router.get("/viewemployee", managercontroller.viewEmployee);
router.get("/viewcandidate", managercontroller.viewCandidate);

module.exports = router;