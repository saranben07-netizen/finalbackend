import express from "express";
import registration from "../../controllers/account_creation/registeration.js";
import { RateLimiterMemory } from "rate-limiter-flexible";

const registerrouter = express.Router();

// ⚡ Rate limiter setup (for registration)
const registerLimiter = new RateLimiterMemory({
  points: 5,           // max 5 registrations
  duration: 30 * 60,   // per 30 minutes
  blockDuration: 30 * 60, // block for 30 minutes after limit exceeded
});

// Middleware for rate limiting
const registerRateLimiter = async (req, res, next) => {
  try {
    const key = req.body.email || req.ip; // limit by email if available
    await registerLimiter.consume(key);
    next();
  } catch {
    return res.status(429).json({
      success: false,
      message: "Too many registration attempts. Please try again later.",
    });
  }
};

// Apply middleware to the /register route
registerrouter.use("/register", registerRateLimiter, registration);

export default registerrouter;
