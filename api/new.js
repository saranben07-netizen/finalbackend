import express from "express";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import Pool from "../database/database.js";

const router = express.Router();

// Initialize Cashfree in SANDBOX mode
const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  "TEST108360771478c4665f846cfe949877063801",
  "cfsk_ma_test_b560921740a233497ed2b83bf3ce4599_113f10f2"
);

// Create order
router.post("/create-order", async (req, res) => {
  const orderId = req.body.id;
  try {
    const data1 = await Pool.query(`SELECT amount FROM orders WHERE id = $1`, [orderId]);
    if (!data1.rows.length) return res.status(404).json({ error: "Order not found" });
    
    const amount = data1.rows[0].amount;

    const request = {
      order_id: orderId,
      order_amount: amount || "1",
      order_currency: "INR",
      customer_details: {
        customer_id: "test_user_1",
        customer_name: "Saran",
        customer_email: "example@gmail.com",
        customer_phone: "9999999999",
      },
      order_meta: {
        return_url: `http://localhost:5000/payment-return?order_id=${orderId}`,
      },
      order_note: "Test UPI payment",
    };

    const response = await cashfree.PGCreateOrder(request);
    res.json(response.data);
  } catch (err) {
    console.error("Error creating order:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

// Payment return
router.get("/payment-return", async (req, res) => {
  try {
    const { order_id } = req.query;
    if (!order_id) return res.send("Missing order_id in query");

    const response = await cashfree.PGOrderFetchPayments(order_id, order_id);
    const payments = response.data.payments || [];
    const status = payments.some(p => p.status === "SUCCESS") ? "SUCCESS" : "FAILED";

    await Pool.query("UPDATE orders SET status=$1 WHERE id=$2", [status, order_id]);

    res.send(`<h2>Payment ${status} for order ${order_id}</h2>`);
  } catch (err) {
    console.error(err);
    res.send("Error fetching or updating payment status.");
  }
});

export default router;
