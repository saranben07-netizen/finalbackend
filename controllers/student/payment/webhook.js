import pool from "../../../database/database.js";
import { Cashfree, CFEnvironment } from "cashfree-pg";

// Initialize Cashfree SDK
const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CLIENT_ID || "TEST108360771478c4665f846cfe949877063801",
  process.env.CLIENT_SECRET || "cfsk_ma_test_b560921740a233497ed2b83bf3ce4599_113f10f2"
);

export default async function paymentWebhook(req, res) {
  try {
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];
    const rawBody = req.rawBody;

    // ✅ Verify authenticity
    const isValid = cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);

    if (!isValid) {
      console.log("❌ Invalid webhook signature");
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    console.log("✅ Webhook verified successfully!");
    console.log("Webhook data:", req.body);

    // Extract important data
    const eventData = req.body;
    console.log(eventData)
    const orderId = eventData.order_id;              // custom order ID you generated
    const cfOrderId = eventData.cf_order_id;         // Cashfree's internal order ID
    const orderStatus = eventData.order_status;      // Example: "PAID", "FAILED", etc.

    // Decide your internal status
    let newStatus = "PENDING";
    if (orderStatus === "PAID") newStatus = "PAID";
    else if (orderStatus === "FAILED") newStatus = "FAILED";
    else if (orderStatus === "VOID") newStatus = "CANCELLED";

    // ✅ Update your database
    await pool.query(
      `UPDATE mess_bill_for_students 
       SET status = $1, updated_at = NOW() 
       WHERE latest_order_id = $2`,
      [newStatus, orderId]
    );

    console.log(`✅ Updated order (${orderId}) to status: ${newStatus}`);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
