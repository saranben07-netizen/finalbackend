import pool from "../../../database/database.js";

async function adminreject(req, res) {
  try {
    const { registerno, token, reason } = req.body;

    // ✅ Validate input
    if (!registerno) {
      return res.status(400).json({
        success: false,
        message: "Registration number is required",token
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",token
      });
    }

    // ✅ Update student status
    const updateResult = await pool.query(
      `UPDATE students 
       SET status = $1 
       WHERE registration_number = $2 
       RETURNING id, registration_number, email, status`,
      [false, registerno]
    );

    // ✅ Check if student exists
    if (updateResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No student found with this registration number",token
      });
    }

    const updatedStudent = updateResult.rows[0];

    // ✅ Insert rejection reason after confirming student exists
    await pool.query(
      `INSERT INTO rejection_reasons (student_id, reason) VALUES ($1, $2)`,
      [updatedStudent.id, reason]
    );

    return res.status(200).json({
      success: true,
      message: "Student rejected successfully",
      student: updatedStudent,
      token, // optional if needed
    });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,token
    });
  }
}

export default adminreject;
