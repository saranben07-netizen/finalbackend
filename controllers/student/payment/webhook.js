// controllers/student/payment/webhook.js
import { Cashfree, CFEnvironment } from "cashfree-pg";

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CLIENT_ID || "TEST108360771478c4665f846cfe949877063801",
  process.env.CLIENT_SECRET || "cfsk_ma_test_b560921740a233497ed2b83bf3ce4599_113f10f2"
);

export default function paymentWebhook(req, res) {
  try {
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];
    const rawBody = req.rawBody;

    // ✅ Verify webhook authenticity
    const isValid = cashfree.PGVerifyWebhookSignature(signature, rawBody, timestamp);

    if (isValid) {
      console.log("✅ Webhook verified successfully!");
      console.log("Webhook data:", req.body);

      // TODO: You can now handle payment success, order update, etc.
      res.status(200).json({ success: true });
    } else {
      console.log("❌ Invalid webhook signature");
      res.status(400).json({ success: false });
    }
  } catch (err) {
    console.error("Webhook verification error:", err.message);
    res.status(500).json({ error: err.message });
  }
}


