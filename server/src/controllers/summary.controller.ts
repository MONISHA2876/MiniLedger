import express = require("express");
import loanService = require("../services/loan.service");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const summary = await loanService.getSummary(res.locals.user.id);

    res.json({
      totalLent: Number(summary.total_lent),
      totalRepaid: Number(summary.total_repaid),
      overdueAmount: Number(summary.overdue_amount),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch summary" });
  }
});

export = router;