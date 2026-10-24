import express = require("express");
import authController = require("../controllers/auth.controller");

const router = express.Router();

router.use("/", authController);

export = router;