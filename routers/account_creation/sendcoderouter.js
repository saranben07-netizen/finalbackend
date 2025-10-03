import express from "express";
import sendcode from "../../controllers/account_creation/sendcode.js";
import { RateLimiterMemory } from "rate-limiter-flexible";

const sendcoderouter = express.Router();

// ✅ 5 requests per 10 minutes per IP
const sendCodeLimiter = new RateLimiterMemory({
  points: 5,
  duration: 600, // 600 seconds = 10 mins
});

async function rateLimiterMiddleware(req, res, next) {
  try {
    await sendCodeLimiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({
      success: false,
      message: "Too many attempts. Please wait 10 minutes.",
    });
  }
}

sendcoderouter.post("/sendcode", rateLimiterMiddleware, sendcode);

export default sendcoderouter;
