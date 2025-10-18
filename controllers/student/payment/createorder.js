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

async function createorder(req, res) {
  try {
    const { student_id, year_month, student_name, student_email, student_phone } = req.body;

    if (!student_id || !year_month) {
      return res.status(400).json({ error: "student_id and year_month are required" });
    }

    // 1️⃣ Fetch bill details with status and mess_fee_per_day
    const billQuery = await pool.query(
      `SELECT mb.id AS bill_id, mb.number_of_days, mb.status, mb.monthly_base_cost_id, 
              mbd.mess_fee_per_day
       FROM mess_bill_for_students mb
       LEFT JOIN monthly_base_costs mbd
         ON mb.monthly_base_cost_id = mbd.id
       WHERE mb.student_id = $1 AND mbd.month_year = $2`,
      [student_id, year_month]
    );

    if (billQuery.rows.length === 0) {
      return res.status(404).json({ error: "Bill not found for this student and month" });
    }

    const bill = billQuery.rows[0];

    // 2️⃣ Prevent payment if already SUCCESS
    if (bill.status === "SUCCESS") {
      return res.status(400).json({ error: "Payment already completed for this month." });
    }

    const per_day_amount = Number(bill.mess_fee_per_day) || 0;
    const number_of_days = Number(bill.number_of_days) || 30;
    const total_amount = per_day_amount * number_of_days;

    // 3️⃣ Generate unique order_id
    const orderId = generateOrderId(student_id, year_month);

    // 4️⃣ Prepare Cashfree order request
    const request = {
      order_amount: total_amount || 1, // fallback to 1 if 0
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: student_id,
        customer_name: student_name || "Student Name",
        customer_email: student_email || "example@gmail.com",
        customer_phone: student_phone || "9999999999",
      },
      order_note: `Mess bill for ${year_month}`,
      order_meta: {
        notify_url: "https://finalbackend1.vercel.app/webhook/",
      },
      order_tags: {
        student_id: student_id,
        mess_bill_id: bill.bill_id,
      },
    };

    // 5️⃣ Create order on Cashfree
    const response = await cashfree.PGCreateOrder(request);

    // 6️⃣ Update latest_order_id in database
    await pool.query(
      `UPDATE mess_bill_for_students 
       SET latest_order_id = $1, updated_at = NOW()
       WHERE id = $2`,
      [response.data.cf_order_id, bill.bill_id]
    );

    console.log("✅ Cashfree order request:", response);

    res.json({ message: "Order created successfully", cashfree_response: response.data });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default createorder;
