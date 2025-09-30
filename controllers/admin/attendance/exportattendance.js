import pool from "../../../database/database.js";
import { Parser } from "json2csv";
import nodemailer from "nodemailer";

async function exportAttendance(req, res) {
  try {
    const { from, to, email, delete1,token } = req.body;

    if (!from || !to) {
      return res
        .status(400)
        .json({ success: false, error: "'from' and 'to' dates are required",token});
    }

    if (!email) {
      return res
        .status(400)
        .json({ success: false, error: "Recipient email is required" ,token});
    }

    // Ensure correct DATE format for Postgres
    const fromDate = new Date(from).toISOString().split("T")[0];
    const toDate = new Date(to).toISOString().split("T")[0];

    // Fetch attendance data
    const query = `
      SELECT students.id, students.name, attendance.date, attendance.status
      FROM students
      INNER JOIN attendance ON students.id = attendance.student_id
      WHERE attendance.date BETWEEN $1 AND $2
      ORDER BY attendance.date ASC
    `;
    const result = await pool.query(query, [fromDate, toDate]);
    const data = result.rows;

    if (!data.length) {
      return res.json({ success: false, message: "No attendance records found" ,token});
    }

    // Convert to CSV
    const parser = new Parser();
    const csv = parser.parse(data);

    // Safe filename
    const safeFrom = fromDate.replace(/[: ]/g, "_");
    const safeTo = toDate.replace(/[: ]/g, "_");
    const filename = `attendance_${safeFrom}_${safeTo}.csv`;

    // Send CSV via email
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.PASS_KEY, // app password if 2FA enabled
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_ID,
        to: email,
        subject: `Attendance Records (${fromDate} to ${toDate})`,
        text: "Attached is the CSV file of attendance records.",
        attachments: [
          {
            filename,
            content: Buffer.from(csv, "utf-8"),
          },
        ],
      };

      await transporter.sendMail(mailOptions);
      console.log("Attendance CSV sent via email to", email);

      if (delete1) {
        await pool.query(
          "DELETE FROM attendance WHERE date BETWEEN $1::date AND $2::date",
          [fromDate, toDate]
        );
        console.log("Deleted attendance records between", fromDate, "and", toDate);
      }

      return res.json({
        success: true,
        message: "Attendance CSV sent via email successfully",token
      });
    } catch (err) {
      console.error("Email send error:", err.stack || err);
      return res
        .status(500)
        .json({ success: false, error: "Failed to send email",token });
    }
  } catch (error) {
    console.error("Error in exportAttendance:", error.stack || error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error",token });
  }
}

export default exportAttendance;
