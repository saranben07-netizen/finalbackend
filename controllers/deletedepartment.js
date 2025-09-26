import pool from "../database/database.js";

async function deletedepartment(req, res) {
  const { department_id } = req.body;

  // 1️⃣ Validate input
  if (!department_id) {
    return res.status(400).json({
      success: false,
      message: "Department ID is required",
    });
  }

  try {
    // 2️⃣ Execute DELETE query
    const result = await pool.query(
      `DELETE FROM departments WHERE id = $1 RETURNING *`,
      [department_id]
    );

    // 3️⃣ Check if any row was deleted
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Department not found or already deleted",
      });
    }

    // 4️⃣ Success response
    return res.json({
      success: true,
      message: "Department deleted successfully",
      deletedDepartment: result.rows[0], // optional: return deleted row
    });
  } catch (error) {
    console.error("Error deleting department:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting department",
    });
  }
}

export default deletedepartment;
