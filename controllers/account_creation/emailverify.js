import pool from "../../database/database.js";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";

async function emailverify(req, res) {
  const { email, code, token } = req.body;

  // Function to generate new random sequence
  function generateRandomString(length = 10) {
      return randomstring.generate({
        length: length,
        charset: "alphanumeric!@#$%^&*()"
      });
  }

  // Fetch the registration verification record
  const result = await pool.query(
    `SELECT * FROM registration_email_verification WHERE email = $1`,
    [email]
  );

  if (result.rowCount === 0) {
    return res.json({
      success: false,
      message: "No registration verification found for this email. Please initiate the registration process."
    });
  }

  // Verify JWT token
  let decode;
  try {
    decode = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    return res.json({ success: false, message: "Invalid or expired token" });
  }

  if (decode.sequence !== result.rows[0].sequence) {
    return res.json({ success: false, message: "Token mismatch" });
  }

  // Check if the entire verification process has expired
  if (result.rows[0].entire_expire && result.rows[0].entire_expire < new Date()) {
    return res.json({ success: false, message: "Verification time expired. Please start again." });
  }

  // Only proceed if token and step are correct
  if (result.rows[0].token === token && (result.rows[0].step === '3' || result.rows[0].step === '4')) {

    if (result.rows[0].code == code) {
        // Generate new sequence and token
        const sequence = generateRandomString();
        const newToken = jwt.sign({ email, sequence }, process.env.SECRET_KEY);

        // Mark email as verified
        await pool.query(
          `UPDATE registration_email_verification
           SET verified = $1,
               step = '4',
               token = $3,
               sequence = $4
           WHERE email = $2`,
           [true, email, newToken, sequence]
        );

        return res.json({ success: true, message: "Email verified successfully", token: newToken });
    } else {
        return res.json({ success: false, message: "Invalid code" });
    }

  } else {
    return res.json({ success: false, message: "Invalid token or step" });
  }
}

export default emailverify;
