import express from "express";
import bodyParser from "body-parser";
import pool from "../../../database/database.js";
import { Cashfree, CFEnvironment } from "cashfree-pg";

const router = express.Router();

// Initialize Cashfree (PG)
const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CF_APP_ID,      // your Cashfree App ID
  process.env.CF_SECRET_KEY   // your Cashfree Secret Key
);

// Webhook route
router.post(
  "/webhook",
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString(); // needed for signature verification
    },
  }),
  async (req, res) => {
    try {
      const signature = req.headers["x-webhook-signature"];
      const timestamp = req.headers["x-webhook-timestamp"];

      if (!signature || !timestamp) {
        console.error("Missing signature or timestamp headers");
        return res.status(400).json({ message: "Missing headers" });
      }

      // ✅ Verify the webhook signature
      const verified = cashfree.PGVerifyWebhookSignature(
        signature,
        req.rawBody,
        timestamp
      );

      if (!verified) {
        console.error("❌ Invalid webhook signature!");
        return res.status(400).json({ message: "Invalid signature" });
      }

      console.log("✅ Webhook verified successfully!");
      console.log("Webhook payload:", req.body);

      const { order_id, order_status, payment_id, order_amount, order_currency } = req.body;

      // ✅ Update order details in DB
     /* await pool.query(
        `UPDATE orders 
         SET status=$1, payment_id=$2, amount=$3, currency=$4 
         WHERE order_id=$5`,
        [order_status, payment_id, order_amount, order_currency, order_id]
      );*/

      res.status(200).json({ message: "Webhook processed successfully" });
    } catch (err) {
      console.error("Error processing webhook:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
