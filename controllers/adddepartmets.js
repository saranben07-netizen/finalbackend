import pool from "../database/database.js";

async function adddepartments(req, res) {
  try {
    const { department } = req.body;

    // ✅ Validate input
    if (!department || department.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    // ✅ Insert department
    const result = await pool.query(
      `INSERT INTO departments (department) VALUES ($1) RETURNING id, department`,
      [department.trim()]
    );

    if (result.rowCount > 0) {
      return res.status(201).json({
        success: true,
        message: "Department added successfully",
        department: result.rows[0],
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to add department",
      });
    }
  } catch (error) {
    console.error("Error adding department:", error);

    // Handle unique constraint or other DB errors
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Department already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

export default adddepartments;
