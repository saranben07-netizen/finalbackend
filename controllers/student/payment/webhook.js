import pool from "../../../database/database.js";
import crypto from "crypto";

// Verify webhook signature function
function verifySignature(body, signature, secret) {
    const hash = crypto.createHmac("sha256", secret)
        .update(JSON.stringify(body))
        .digest("hex");
    return hash === signature;
}

// Webhook controller
async function paymentWebhook(req, res) {
    try {
        const secret = "cf_test_webhook_secret"; // Replace with your Cashfree webhook secret
        const signature = req.headers["x-cf-webhook-signature"];

        if (!verifySignature(req.body, signature, secret)) {
            return res.status(401).json({ message: "Invalid signature" });
        }

        const event = req.body; 
        const { order_id, order_status, payment_id, amount, currency } = event;

        console.log("Webhook received:", event);

        // Update order status in your DB
        await pool.query(
            "UPDATE orders SET status=$1, payment_id=$2, amount=$3, currency=$4 WHERE order_id=$5",
            [order_status, payment_id, amount, currency, order_id]
        );

        res.status(200).json({ message: "Webhook processed successfully" });
    } catch (err) {
        console.error("Error processing webhook:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default paymentWebhook;
