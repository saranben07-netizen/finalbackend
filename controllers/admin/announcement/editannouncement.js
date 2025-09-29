import pool from "../../../database/database.js";

async function editannouncement(req, res) {
    const { token, announcement_id, ...data } = req.body;

    if (!announcement_id) {
        return res.status(400).json({ success: false, message: "announcement_id is required" });
    }

    // Remove null or empty values
    function cleanObject(obj) {
        return Object.fromEntries(
            Object.entries(obj).filter(([_, value]) => value !== null && value !== "")
        );
    }

    const cleanedObject = cleanObject(data);

    if (Object.keys(cleanedObject).length === 0) {
        return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    const keys = Object.keys(cleanedObject);
    const values = Object.values(cleanedObject);

    // Build the SET clause dynamically
    const setString = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

    // Add announcement_id as the last parameter
    values.push(announcement_id);

    const query = `UPDATE annocements SET ${setString} WHERE id = $${values.length} RETURNING *`;

    try {
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Announcement not found" });
        }

        const updatedAnnouncement = result.rows[0];

        // If 'target' was updated, update notifications
        if (cleanedObject.hasOwnProperty("target")) {
            // 1️⃣ Delete existing notifications for this announcement
            await pool.query(
                "DELETE FROM students_dashboard_notifications WHERE announcement_id = $1",
                [announcement_id]
            );

            // 2️⃣ Insert notifications based on new target
            if (updatedAnnouncement.target == 5) {
                // Target = All academic years
                await pool.query(`
                    INSERT INTO students_dashboard_notifications (announcement_id, student_id)
                    SELECT $1, s.id
                    FROM students s
                    ON CONFLICT (announcement_id, student_id) DO NOTHING
                `, [announcement_id]);
            } else {
                // Target = Specific academic year
                await pool.query(`
                    INSERT INTO students_dashboard_notifications (announcement_id, student_id)
                    SELECT $1, s.id
                    FROM students s
                    WHERE s.academic_year::integer = $2
                    ON CONFLICT (announcement_id, student_id) DO NOTHING
                `, [announcement_id, updatedAnnouncement.target]);
            }
        }

        res.json({ success: true, updated: updatedAnnouncement });

    } catch (err) {
        console.error("Error updating announcement:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export default editannouncement;
