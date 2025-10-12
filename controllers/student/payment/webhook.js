import pool from "../../../database/database.js";
import crypto from "crypto";

// Middleware to capture raw body
export function rawBodyMiddleware(req, res, buf, encoding) {
    req.rawBody = buf.toString(encoding || 'utf8');
}

// Verify webhook signature function
function verifySignature(rawBody, signature, secret) {
    const timestamp = req.headers["x-webhook-timestamp"];
    const data = timestamp + rawBody;
    const hash = crypto
        .createHmac("sha256", secret)
        .update(data)
        .digest("base64");
    return hash === signature;
}

// Webhook controller
async function paymentWebhook(req, res) {
    try {
        const secret = "cfsk_ma_test_b560921740a233497ed2b83bf3ce4599_113f10f2"; // Replace with your Cashfree webhook secret
        const signature = req.headers["x-webhook-signature"];

       

        const event = JSON.parse(req.rawBody);
        const { order_id, order_status, payment_id, amount, currency } = event;
        console.log(event)

        console.log("Webhook received:", event);

        // Update order status in your DB
        ///await pool.query(
           /// "UPDATE orders SET status=$1, payment_id=$2, amount=$3, currency=$4 WHERE order_id=$5",
            ///[order_status, payment_id, amount, currency, order_id]
       // );

        res.status(200).json({ message: "Webhook processed successfully" });
    } catch (err) {
        console.error("Error processing webhook:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default paymentWebhook;
