import express from "express";
import bodyParser from "body-parser";
import pool from "../../../database/database.js";
import { Cashfree, CFEnvironment } from "cashfree-pg";

const router = express.Router();

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CF_APP_ID,
  process.env.CF_SECRET_KEY
);

router.post(
  "/",
  bodyParser.json({
    verify: (req, res, buf) => { req.rawBody = buf.toString(); }
  }),
  async (req, res) => {
    try {
      const signature = req.headers["x-webhook-signature"];
      const timestamp = req.headers["x-webhook-timestamp"];

      if (!signature || !timestamp) {
        return res.status(400).json({ message: "Missing signature or timestamp" });
      }

      const verified = cashfree.PGVerifyWebhookSignature(signature, req.rawBody, timestamp);
      if (!verified) {
        return res.status(400).json({ message: "Invalid signature" });
      }

      const { order_id, order_status, payment_id } = req.body;

      // Get bill by order_id
      const billRes = await pool.query(
        "SELECT id FROM mess_bill_for_students WHERE latest_order_id = $1",
        [order_id]
      );

      if (!billRes.rows.length) {
        return res.status(404).json({ message: "Bill not found" });
      }

      const billId = billRes.rows[0].id;

      // Update bill status
      await pool.query(
        "UPDATE mess_bill_for_students SET status=$1, updated_at=NOW() WHERE id=$2",
        [order_status, billId]
      );

      // Insert into payment logs
      await pool.query(
        `INSERT INTO mess_payment_logs
          (bill_id, order_id, payment_id, event_type, order_status, raw_payload)
          VALUES ($1, $2, $3, $4, $5, $6)`,
        [billId, order_id, payment_id, "WEBHOOK", order_status, JSON.stringify(req.body)]
      );

      res.status(200).json({ message: "Webhook processed successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
