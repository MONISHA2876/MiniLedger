import express = require("express");
import authMiddleware = require("../middleware/auth.middleware");
import loanController = require("../controllers/loan.controller");

const router = express.Router();

router.use(authMiddleware);
router.use("/", loanController);

export = router;