import pool from "../../../database/database.js";
import { Cashfree, CFEnvironment } from "cashfree-pg";

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  "TEST108360771478c4665f846cfe949877063801",
  "cfsk_ma_test_b560921740a233497ed2b83bf3ce4599_113f10f2"
);

// Generate order_id
function orderid(req) {
    const student_id = req.body.student_id;
    const year_month = req.body.year_month;
    const order_id = student_id + year_month;
    return order_id;
}

async function createorder(req, res) {
    try {
        const orderId = orderid(req);
        const { student_id, year_month } = req.body;

        // Fetch bill amount
        const data = await pool.query(
            `SELECT id ,amount FROM mess_bill_for_students WHERE student_id = $1 AND year_month = $2`,
            [student_id, year_month]
        );

        if (data.rows.length === 0) {
            return res.status(404).json({ error: "Bill not found for this student and month" });
        }

        const amount = data.rows[0].amount;
        const id = data.rows[0].id;

        // Cashfree order request with order_meta
        const request = {
            order_id: orderId,
            order_amount: amount || "1",
            order_currency: "INR",
            customer_details: {
                customer_id: student_id,
                customer_name: "Saran",
                customer_email: "example@gmail.com",
                customer_phone: "9999999999",
            },
            order_note: "Test UPI payment",
            order_meta: {
               // redirect user after payment
                notify_url: "https://finalbackend-mauve.vercel.app/webhook/"           // webhook callback URL
            },
              order_tags: {
        student_id: student_id,
        mess_bill_id:id
      },
        };

        const response = await cashfree.PGCreateOrder(request);

        console.log(request);

        res.json({ message: "Order request created", response: response.data });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export default createorder;
