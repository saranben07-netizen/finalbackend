import pool from "../../../database/database.js";

async function pushannocement(req, res) {
    try {
        const { title, message, priority, target, scheduled_date } = req.body;

        // ✅ Validate required fields
        if (!title || !message || !priority || !target || !scheduled_date) {
            return res.status(400).json({
                success: false,
                message: "All fields (title, message, priority, target, scheduled_date) are required",token:req.body.token
            });
        }

        // ✅ Insert into annocements
        const queryText = `
            INSERT INTO annocements (title, message, priority, target, scheduled_date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const result = await pool.query(queryText, [title, message, priority, target, scheduled_date]);

        const announcementId = result.rows[0].id;

        // ✅ Insert into notifications depending on target
        if (target == 5) {
            // Target = All academic years
            const queryAll = `
                INSERT INTO students_dashboard_notifications (announcement_id, student_id)
                SELECT $1, s.id
                FROM students s
                ON CONFLICT (announcement_id, student_id) DO NOTHING;
            `;
            await pool.query(queryAll, [announcementId]);
        } else {
            // Target = Specific academic year
            const querySpecific = `
                INSERT INTO students_dashboard_notifications (announcement_id, student_id)
                SELECT $1, s.id
                FROM students s
                WHERE s.academic_year::integer = $2
                ON CONFLICT (announcement_id, student_id) DO NOTHING;
            `;
            await pool.query(querySpecific, [announcementId, target]);
        }

        // ✅ Success response
        res.status(201).json({
            success: true,
            message: "Announcement has been sent successfully",
            data: result.rows[0],token:req.body.token
        });

    } catch (error) {
        console.error("Error inserting announcement:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
            token:req.body.token
        });
    }
}

export default pushannocement;
