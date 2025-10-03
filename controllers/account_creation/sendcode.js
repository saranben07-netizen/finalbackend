import pool from "../../database/database.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import randomstring from "randomstring";

async function sendcode(req, res) {
    const { email, token } = req.body;

    // Handle empty email or token
    if (!email || !token) {
        return res.json({ success: false, message: "Email and token are required" });
    }

    let decode;
    try {
        decode = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        return res.json({ success: false, message: "Invalid or expired token" });
    }

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

    // Check if sequence matches
    if (decode.sequence !== result.rows[0].sequence) {
        return res.json({ success: false, message: "Token mismatch" });
    }

    // Check if entire verification has expired
    if (result.rows[0].entire_expire && result.rows[0].entire_expire < new Date()) {
        return res.json({ success: false, message: "Verification time expired. Please start again." });
    }

    // Check if a code was sent recently
    if (result.rows[0].expires_at && result.rows[0].expires_at > new Date()) {
        return res.json({ success: false, message: "A code was already sent. Please wait for 5 minutes." });
    }

    // Generate random sequence for new token
    function generateRandomString(length = 10) {
        return randomstring.generate({
            length: length,
            charset: "alphanumeric!@#$%^&*()"
        });
    }

    // Only proceed if token and step are correct
    if (result.rows[0].token === token && (result.rows[0].step === '2' || result.rows[0].step === '3')) {
        // Generate 6-digit verification code
        const code = Math.floor(100000 + Math.random() * 900000);

        // Configure email transport
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.PASS_KEY
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: email,
            subject: "Your Registration Verification Code",
            text: `Your registration verification code is: ${code}`
        };

        await transporter.sendMail(mailOptions);

        // Generate new sequence and token
        const sequence = generateRandomString();
        const newToken = jwt.sign({ email, sequence }, process.env.SECRET_KEY);

        // Update registration_email_verification table
        await pool.query(
            `UPDATE registration_email_verification
             SET code = $2,
                 expires_at = NOW() + interval '5 minutes',
                 step = '3',
                 token = $3,
                 sequence = $4
             WHERE email = $1`,
            [email, code, newToken, sequence]
        );

        return res.json({ success: true, message: "Verification code sent to email", code, token: newToken });
    } else {
        return res.json({ success: false, message: "Invalid token or step" });
    }
}

export default sendcode;
