import express from "express";
import emailverify from "../../controllers/account_creation/emailverify.js";
import { RateLimiterMemory } from "rate-limiter-flexible";

const emailverifyrouter = express.Router();

// ⚡ Rate limiter setup (for verification attempts)
const verifyLimiter = new RateLimiterMemory({
  points: 5, // max 5 attempts
  duration: 15 * 60, // per 15 minutes (per IP/email)
  blockDuration: 15 * 60, // block for 15 minutes after limit exceeded
});

// Middleware for rate limiting
const verifyRateLimiter = async (req, res, next) => {
  try {
    const key = req.body.email || req.ip; // limit by email (preferred), fallback to IP
    await verifyLimiter.consume(key); // consume 1 point
    next();
  } catch (err) {
    return res.status(429).json({
      success: false,
      message: "Too many verification attempts. Try again later.",
    });
  }
};

// Apply middleware here ⬇️
emailverifyrouter.post("/emailverify", verifyRateLimiter, emailverify);

export default emailverifyrouter;
