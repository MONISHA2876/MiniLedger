import express = require("express");
import jwt = require("jsonwebtoken");
import authService = require("../services/auth.service");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from .env");
}

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, phone } = req.body;

    if (
      typeof username !== "string" ||
      typeof phone !== "string" ||
      !username.trim() ||
      !phone.trim()
    ) {
      res.status(400).json({
        message: "Username and phone are required",
      });
      return;
    }

    const result = await authService.requestOtp(
      phone,
      "signup",
      username
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Signup failed",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phone } = req.body;

    if (typeof phone !== "string" || !phone.trim()) {
      res.status(400).json({ message: "Phone is required" });
      return;
    }

    const result = await authService.requestOtp(phone, "login");

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp, purpose, username } = req.body;

    if (
      typeof phone !== "string" ||
      typeof otp !== "string" ||
      !["signup", "login"].includes(purpose)
    ) {
      res.status(400).json({
        message: "Phone, OTP and a valid purpose are required",
      });
      return;
    }

    if (
      purpose === "signup" &&
      (typeof username !== "string" || !username.trim())
    ) {
      res.status(400).json({ message: "Username is required" });
      return;
    }

    const user = await authService.verifyOtp(
      phone,
      otp,
      purpose,
      username
    );

    const token = jwt.sign(
      { sub: String(user.id), phone: user.phone },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "OTP verified successfully",
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Verification failed",
    });
  }
});

export = router;
