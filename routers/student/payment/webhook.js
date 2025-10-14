import express from "express";
import paymentWebhook from "../../../controllers/student/payment/webhook.js";
import bodyParser from ""

const router = express.Router();

// Cashfree webhook route
router.post("/webhook",  bodyParser.json({
        verify: (req, res, buf) => {
            req.rawBody = buf.toString();
        }}),paymentWebhook);

export default router;
