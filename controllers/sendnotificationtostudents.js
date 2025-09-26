import pool from "../database/database.js";

async function sendNotificationToStudents(req, res) {
    try {
        const { announcement_id } = req.body;

        // Get the announcement
        const result = await pool.query(
            `SELECT * FROM annocements WHERE id = $1`,
            [announcement_id]
        );

        if (!result.rows.length) {
            return res.status(404).json({ success: false, message: "Announcement not found" });
        }

        const target = result.rows[0].target; // academic_year filter

        let insertQuery = '';
        let params = [];

        if (Number(target) === 5) {
            // Send to all students
            insertQuery = `
                INSERT INTO students_dashboard_notifications (announcement_id, student_id)
                SELECT a.id, s.id
                FROM annocements a
                CROSS JOIN students s
                WHERE a.id = $1
                ON CONFLICT (announcement_id, student_id) DO NOTHING
            `;
            params = [announcement_id];
        } else {
            // Send to students with specific academic_year
            insertQuery = `
                INSERT INTO students_dashboard_notifications (announcement_id, student_id)
                SELECT a.id, s.id
                FROM annocements a
                CROSS JOIN students s
                WHERE s.academic_year = $1 AND a.id = $2
                ON CONFLICT (announcement_id, student_id) DO NOTHING
            `;
            params = [target, announcement_id];
        }

        const a = await pool.query(insertQuery, params);
        console.log(a);

        res.json({ success: true, message: "Notifications created for students" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export default sendNotificationToStudents;
