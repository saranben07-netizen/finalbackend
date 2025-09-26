import pool from "../database/database.js";

async function pushannocement(req, res) {
    try {
        const { title, message, priority, target, scheduled_date } = req.body;

        // Check if required fields are present
        if (!title || !message || !priority || !target || !scheduled_date) {
            return res.status(400).json({
                success: false,
                message: "All fields (title, message, priority, target, scheduled_date) are required"
            });
        }

        const queryText = `
            INSERT INTO annoncements (title, message, priority, target, scheduled_date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const result = await pool.query(queryText, [title, message, priority, target, scheduled_date]);

        if (result.rowCount > 0) {
            res.status(201).json({
                success: true,
                message: "Announcement has been sent successfully",
                data: result.rows[0]
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Failed to send announcement"
            });
        }
    } catch (error) {
        console.error("Error inserting announcement:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export default pushannocement;
