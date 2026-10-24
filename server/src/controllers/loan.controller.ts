import express = require("express");
import loanService = require("../services/loan.service");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const userId = res.locals.user.id;
    const { friendName, amount, dueDate } = req.body;

    if (
      typeof friendName !== "string" ||
      !friendName.trim() ||
      friendName.trim().length > 100
    ) {
      res.status(400).json({ message: "Enter a valid friend name" });
      return;
    }

    if (
      amount === undefined ||
      amount === null ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      res.status(400).json({ message: "Amount must be greater than zero" });
      return;
    }

    if (
      typeof dueDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)
    ) {
      res.status(400).json({ message: "Due date must be YYYY-MM-DD" });
      return;
    }

    const date = new Date(`${dueDate}T00:00:00.000Z`);

    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== dueDate
    ) {
      res.status(400).json({ message: "Enter a valid due date" });
      return;
    }

    const loan = await loanService.addLoan(
      userId,
      friendName.trim(),
      Number(amount),
      dueDate
    );

    res.status(201).json({ message: "Loan added successfully", loan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add loan" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const loans = await loanService.getLoans(res.locals.user.id);
    res.json({ loans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch loans" });
  }
});

router.patch("/:id/repay", async (req, res) => {
  try {
    const loanId = Number(req.params.id);

    if (!Number.isSafeInteger(loanId) || loanId <= 0) {
      res.status(400).json({ message: "Invalid loan ID" });
      return;
    }

    const loan = await loanService.repayLoan(
      res.locals.user.id,
      loanId
    );

    if (!loan) {
      res.status(404).json({
        message: "Loan not found or already repaid",
      });
      return;
    }

    res.json({ message: "Loan marked as repaid", loan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update loan" });
  }
});

export = router;