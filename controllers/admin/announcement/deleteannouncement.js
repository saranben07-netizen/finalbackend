import pool from "../../../database/database.js";

async function deleteannouncement(req, res) {
  try {
    const { announcement_id } = req.body;

    if (!announcement_id) {
      return res.status(400).json({ success: false, message: "announcement_id is required" ,token:req.body.token});
    }

    // 1️⃣ Delete notifications related to this announcement
    await pool.query(
      "DELETE FROM students_dashboard_notifications WHERE announcement_id = $1",
      [announcement_id]
    );

    // 2️⃣ Delete the announcement itself
    const result = await pool.query(
      "DELETE FROM annocements WHERE id = $1 RETURNING *",
      [announcement_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Announcement not found",token:req.body.token  });
    }

    return res.json({
      success: true,
      message: "Announcement and related notifications deleted successfully",
      deleted: result.rows[0],token:req.body.token
    });

  } catch (err) {
    console.error("Error deleting announcement:", err);
    return res.status(500).json({ success: false, message: "Internal server error" , token:req.body.token });
  }
}

export default deleteannouncement;
