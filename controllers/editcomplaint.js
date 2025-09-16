import pool from "../database/database.js";

async function editcomplaint(req, res) {
  try {
    const { complaint_id, title, description, category, priority } = req.body;
    console.log("Incoming data:", complaint_id, title, description, category, priority);

    if (!complaint_id) {
      return res.status(400).json({
        success: false,
        message: "Complaint ID is required",
      });
    }

    const query = `
      UPDATE complaints
      SET title = $1,
          description = $2,
          category = $3,
          priority = $4,
          updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `;

    const values = [title, description, category, priority, complaint_id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.json({
      success: true,
      message: "Complaint updated successfully",
      complaint: result.rows[0],
    });

  } catch (err) {
    console.error("Error editing complaint:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export default editcomplaint;
