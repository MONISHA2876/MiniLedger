import express = require("express");
import authMiddleware = require("../middleware/auth.middleware");
import summaryController = require("../controllers/summary.controller");

const router = express.Router();

router.use(authMiddleware);
router.use("/", summaryController);

export = router;