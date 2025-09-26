import pool from "../database/database.js";
import { Parser } from "json2csv";
import nodemailer from "nodemailer";

async function promotion(req, res) {
  try {
    const { email, isdeletefinalyear } = req.body; // recipient email for 4th-year CSV

    if (!email) {
      return res.status(400).json({ success: false, error: "Recipient email is required" });
    }

    // -------------------- Handle 4th-year first: export CSV --------------------
    const result4 = await pool.query("SELECT * FROM students WHERE academic_year = $1", ["4"]);
    const data4 = result4.rows;

    if (data4.length > 0) {
      // 1️⃣ Convert to CSV
      const parser = new Parser();
      const csv = parser.parse(data4);

      // 2️⃣ Send CSV via email
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
        subject: "4th Year Students CSV",
        text: "Attached is the CSV file of 4th-year students before deletion.",
        attachments: [
          {
            filename: `students_${new Date().getFullYear()}.csv`,
            content: Buffer.from(csv),
          },
        ],
      };

      await transporter.sendMail(mailOptions);
      console.log("CSV sent via email to", email);

      // 3️⃣ Delete 4th-year students if flag is true
      if (isdeletefinalyear) {
        const deleteResult = await pool.query("DELETE FROM students WHERE academic_year = $1", ["4"]);
        console.log(`${deleteResult.rowCount} 4th-year students deleted.`);
      }

    } else {
      console.log("No 4th-year students found to export/delete.");
    }

    // -------------------- Promote 3->4, 2->3, 1->2 --------------------
    for (let year = 3; year >= 1; year--) {
      const nextYear = (year + 1).toString();
      const resultUpdate = await pool.query(
        "UPDATE students SET academic_year = $1 WHERE academic_year = $2",
        [nextYear, year.toString()]
      );
      console.log(`Promoted ${resultUpdate.rowCount} students from year ${year} to ${nextYear}`);
    }

    return res.json({
      success: true,
      message: "Promotion completed successfully. 4th-year CSV sent and deleted if applicable, other years promoted.",
    });

  } catch (error) {
    console.error("Error in promotion:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export default promotion;
