import pool from "../../../database/database.js";
import { Cashfree, CFEnvironment } from "cashfree-pg";

// Cashfree config
const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  "TEST108360771478c4665f846cfe949877063801",
  "cfsk_ma_test_b560921740a233497ed2b83bf3ce4599_113f10f2"
);

// Generate unique order_id (student_id + year_month + timestamp)
function generateOrderId(student_id, year_month) {
  const timestamp = Date.now();
  return `${student_id}_${year_month}_${timestamp}`;
}

// Create order route
async function createorder(req, res) {
  try {
    const { student_id, year_month, student_name, student_email, student_phone } = req.body;

    // 1️⃣ Fetch bill for student/month
    const billQuery = await pool.query(
      `SELECT id, amount FROM mess_bill_for_students 
       WHERE student_id = $1 AND year_month = $2`,
      [student_id, year_month]
    );

    if (billQuery.rows.length === 0) {

      return res.status(404).json({ error: "Bill not found for this student and month" });
    }

    const billId = billQuery.rows[0].id;
    const amount = billQuery.rows[0].amount || 1; // fallback

    // 2️⃣ Generate unique order_id
    const orderId = generateOrderId(student_id, year_month);

    // 3️⃣ Prepare Cashfree order request
 const request = {
  order_amount: amount || "1",
  order_currency: "INR",
  order_id: orderId, // generated order_id
  customer_details: {
    customer_id: student_id,
    customer_name: student_name || "Student Name",
    customer_email: student_email || "example@gmail.com",
    customer_phone: student_phone || "9999999999", // <--- REQUIRED
  },
  order_note: `Mess bill for ${year_month}`,
  order_meta: {
    notify_url: "https://finalbackend1.vercel.app/webhook/"
  },
  order_tags: {
    student_id: student_id,
    mess_bill_id: billId
  },
};


  
    const response = await cashfree.PGCreateOrder(request);
    await pool.query(
  `UPDATE mess_bill_for_students 
   SET latest_order_id = $1 
   WHERE id = $2`,
  [response.data.cf_order_id, billId]
);


   

    console.log("✅ Cashfree order request:", response);

    res.json({ message: "Order created successfully", cashfree_response: response.data });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default createorder;
