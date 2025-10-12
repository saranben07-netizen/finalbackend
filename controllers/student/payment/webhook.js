import pool from "../../../database/database.js";

// Webhook controller (without signature verification)
async function paymentWebhook(req, res) {
    try {
        // Log the incoming body
        console.log("Webhook payload:", req.body);

        const event = req.body;
        console.log(req)

        // Extract necessary fields safely
        const { order_id, order_status, payment_id, amount, currency } = event;

        console.log("Order ID:", order_id);
        console.log("Order Status:", order_status);

        // Optionally update your database
        /*
        await pool.query(
            "UPDATE orders SET status=$1, payment_id=$2, amount=$3, currency=$4 WHERE order_id=$5",
            [order_status, payment_id, amount, currency, order_id]
        );
        */

        res.status(200).json({ message: "Webhook processed successfully" });
    } catch (err) {
        console.error("Error processing webhook:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default paymentWebhook;
