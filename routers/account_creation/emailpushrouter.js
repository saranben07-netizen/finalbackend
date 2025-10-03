import express from "express";
import emailpush from "../../controllers/account_creation/emailpush.js";
import { RateLimiterMemory } from "rate-limiter-flexible";

const emailpushrouter = express.Router();

// ✅ Limit: 3 requests per 10 minutes per IP
const emailPushLimiter = new RateLimiterMemory({
  points: 3,       // number of requests
  duration: 600,   // per 600 seconds (10 minutes)
});

async function rateLimiterMiddleware(req, res, next) {
  try {
    await emailPushLimiter.consume(req.ip); // track by client IP
    next();
  } catch {
    res.status(429).json({
      success: false,
      message: "Too many requests for email verification. Please wait 10 minutes before trying again.",
    });
  }
}

// ✅ Attach limiter to the route
emailpushrouter.post("/emailpush", rateLimiterMiddleware, emailpush);

export default emailpushrouter;
