import pool from "../../../database/database.js";
import express from "express";
import Cashfree from "cashfree-sdk";

// Your client secret from Cashfree dashboard
const clientSecret = process.env.CF_PAYOUT_SECRET;

// Webhook controller with signature verification
async function paymentWebhook(req, res) {
    try {
        // Convert the raw body to JSON string for verification
        const webhookPostDataJson = JSON.stringify(req.body);

        // Cashfree sends the signature in a header (usually 'x-webhook-signature')
        const signature = req.headers['x-webhook-signature'];
        if (!signature) {
            console.error("Signature header missing");
            return res.status(400).json({ message: "Missing signature" });
        }

        // Verify the webhook signature
        const isValid = Cashfree.Payouts.VerifySignature(webhookPostDataJson, signature, clientSecret);

        if (!isValid) {
            console.error("Invalid webhook signature!");
            return res.status(400).json({ message: "Invalid signature" });
        }

        console.log("✅ Webhook verified successfully!");
        console.log("Webhook payload:", req.body);

        // Extract necessary fields safely
        const { order_id, order_status, payment_id, amount, currency } = req.body;

        console.log("Order ID:", order_id);
        console.log("Order Status:", order_status);

        // Update database if needed
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
