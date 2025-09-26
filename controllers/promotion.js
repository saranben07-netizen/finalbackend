import pool from "../database/database.js";
import { Parser } from "json2csv";
import nodemailer from "nodemailer";

async function promotion(req, res) {
  try {
    const { year, email } = req.body; // recipient email

    if (!year || isNaN(Number(year))) {
      return res.status(400).json({ success: false, error: "Invalid or missing 'year' value" });
    }

    if (!email) {
      return res.status(400).json({ success: false, error: "Recipient email is required" });
    }

    // If 4th-year, export CSV before promotion
    if (Number(year) === 4) {
      const query4 = "SELECT * FROM students WHERE academic_year = $1";
      const result4 = await pool.query(query4, ["4"]);
      const data4 = result4.rows;

      if (data4.length > 0) {
        const parser = new Parser();
        const csv = parser.parse(data4);

        // Send CSV via email
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_ID, // your Gmail
              pass: process.env.PASS_KEY, // app password if 2FA enabled
            },
          });

          const mailOptions = {
            from: process.env.EMAIL_ID,
            to: email,
            subject: "4th Year Students CSV",
            text: "Attached is the CSV file of 4th-year students.",
            attachments: [
              {
                filename: `students_${new Date().getFullYear()}.csv`,
                content: Buffer.from(csv),
              },
            ],
          };

          await transporter.sendMail(mailOptions);
          console.log("CSV sent via email to", email);

          // -------------------- Delete 4th-year students after email --------------------
          const deleteQuery = "DELETE FROM students WHERE academic_year = $1";
          try{ const deleteResult = await pool.query(deleteQuery, ["4"]);}
          catch(e){
            console.log(e)
          }
         
          
          console.log(`${deleteResult.rowCount} 4th-year students deleted from the table.`);

        } catch (err) {
          console.error("Email send error:", err);
          return res.status(500).json({ success: false, error: "Failed to send email" });
        }
      } else {
        return res.json({ success: false, message: "No 4th-year students found" });
      }

      return res.json({ success: true, message: "CSV sent via email and records deleted successfully" });
    }

    // Promote students
    const updation = (Number(year) + 1).toString();
    const queryUpdate = "UPDATE students SET academic_year = $1 WHERE academic_year = $2";
    const resultUpdate = await pool.query(queryUpdate, [updation, year]);

    if (resultUpdate.rowCount > 0) {
      return res.json({ success: true, updatedRows: resultUpdate.rowCount });
    } else {
      return res.json({ success: false, message: "No students found for the given academic year" });
    }

  } catch (error) {
    console.error("Error in promotion:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export default promotion;
