import e from "express";
import pool from "../../database/database.js";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";

async function emailpush(req, res) {
    const { email } = req.body;

    // Handle empty email field
    if (!email) {
        return res.json({ success: false, message: "Email is required" });
    }

    // Function to generate random sequence
    function generateRandomString(length = 10) {
        return randomstring.generate({
            length: length,
            charset: "alphanumeric!@#$%^&*()"
        });
    }

    let token;

    // Check if email is already registered in 'students' table
    const fetchStudent = await pool.query(
        "SELECT * FROM students WHERE email = $1",
        [email]
    );

    if (fetchStudent.rowCount > 0) {
        return res.json({ success: false, message: "Email is already registered" });
    }

    // Check if a registration verification process is already ongoing
    const existing = await pool.query(
        "SELECT * FROM registration_email_verification WHERE email = $1",
        [email]
    );

    if (existing.rowCount > 0) {
        const expired = existing.rows[0].entire_expire;

        // If previous verification is still valid
        if (expired && expired > new Date()) {
            return res.json({
                success: false,
                message: "A registration verification is already ongoing. Please check your email or try again later."
            });
        } else {
            const sequence = generateRandomString();
            token = jwt.sign({ email, sequence }, process.env.SECRET_KEY);

            if (existing.rows[0].verified) {
                // Re-initialize verification for previously verified email
                await pool.query(
                    `UPDATE registration_email_verification
                     SET verified = $1, step = '2', token = $3,
                         entire_expire = NOW() + interval '10 minutes',
                         sequence = $4
                     WHERE email = $2`,
                    [false, email, token, sequence]
                );
                return res.json({ success: true, message: "Verification re-initialized.", token });
            } else {
                // Update token and expiration for pending verification
                await pool.query(
                    `UPDATE registration_email_verification
                     SET step = '2', token = $2, entire_expire = NOW() + interval '10 minutes',
                         sequence = $3
                     WHERE email = $1`,
                    [email, token, sequence]
                );
                return res.json({ success: true, message: "Verification is pending.", token });
            }
        }
    } else {
        // Start a new verification process
        const sequence = generateRandomString();
        token = jwt.sign({ email, sequence }, process.env.SECRET_KEY);

        await pool.query(
            `INSERT INTO registration_email_verification
             (email, token, step, verified, entire_expire, sequence)
             VALUES ($1, $2, '2', $3, NOW() + interval '10 minutes', $4)`,
            [email, token, false, sequence]
        );

        return res.json({ success: true, message: "Registration verification process started.", token });
    }
}

export default emailpush;
