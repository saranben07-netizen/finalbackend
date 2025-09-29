import pool from "../../../database/database.js";

async function dismissnotification(req, res) {
  try {
    const { notification_id } = req.body;

    // 1️⃣ Validate input
    if (!notification_id) {
      return res.status(400).json({
        success: false,
        message: "notification_id is required",
      });
    }

    // 2️⃣ Execute the DELETE query
    const result = await pool.query(
      `DELETE FROM students_dashboard_notifications 
       WHERE id = $1`,
      [notification_id]
    );

    // 3️⃣ Check if any row was deleted
    if (result.rowCount > 0) {
      return res.json({
        success: true,
        message: "Notification deleted successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting notification",
    });
  }
}

export default dismissnotification;
