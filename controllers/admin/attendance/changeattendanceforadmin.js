import pool from "../../../database/database.js";

async function changeattendancebyadmin(req, res) {
  try {
    const { attendance_id, update ,token} = req.body;

    // ✅ Validate input
    if (!attendance_id || !update) {
      return res.status(400).json({
        success: false,
        message: "attendance_id and update (status) are required",token
      });
    }

    // ✅ Run update query
    const query = "UPDATE attendance SET status = $1 WHERE id = $2";
    const result = await pool.query(query, [update, attendance_id]);

    // ✅ Check if record exists
    if (result.rowCount > 0) {
      return res.status(200).json({
        success: true,
        message: "Attendance updated successfully",
        updated_id: attendance_id,token
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",token
      });
    }
  } catch (error) {
    console.error("Error updating attendance:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating attendance",
      error: error.message,token
    });
  }
}

export default changeattendancebyadmin;
