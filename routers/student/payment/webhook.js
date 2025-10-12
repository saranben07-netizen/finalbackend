import express from "express";
import paymentWebhook from "../../../controllers/student/payment/webhook.js";

const router = express.Router();

// Cashfree webhook route
router.post("/webhook", paymentWebhook);

export default router;
