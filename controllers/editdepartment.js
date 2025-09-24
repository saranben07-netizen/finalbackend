import pool from "../database/database.js";

async function editdepartment(req, res) {
  try {
    const { oldDepartment, newDepartment } = req.body;

    // ✅ Validate input
    if (!oldDepartment || !newDepartment) {
      return res.status(400).json({
        success: false,
        message: "Both oldDepartment and newDepartment are required",
      });
    }

    // ✅ Update department
    const result = await pool.query(
      `UPDATE departments 
       SET department = $1 
       WHERE department = $2`,
      [newDepartment.trim(), oldDepartment.trim()]
    );

    if (result.rowCount > 0) {
      return res.json({ success: true, message: "Department updated successfully" });
    } else {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }
  } catch (error) {
    console.error("Error updating department:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export default editdepartment;
