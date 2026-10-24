import express = require("express");
import cors = require("cors");
import authRoutes = require("./routes/auth.routes");
import loanRoutes = require("./routes/loan.routes");
import summaryRoutes = require("./routes/summary.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "MiniLedger API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/summary", summaryRoutes);

export = app;