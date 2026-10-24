import express = require("express");
import jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from .env");
}

const authMiddleware: express.RequestHandler = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication token required" });
    return;
  }

  const token = authorization.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    if (!decoded.sub || !decoded.phone) {
      res.status(401).json({ message: "Invalid authentication token" });
      return;
    }

    res.locals.user = {
      id: Number(decoded.sub),
      phone: decoded.phone,
    };

    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export = authMiddleware;