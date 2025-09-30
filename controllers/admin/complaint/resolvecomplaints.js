import pool from "../../../database/database.js";

async function resolvecomplaints(req, res) {
  try {
    const id = req.body.complaint_id;
    const token = req.body.token

    if (!id) {
      return res.status(400).json({ success: false, message: "Complaint ID is required",token });
    }

    const query = `
      UPDATE complaints
      SET resolved = TRUE,
          status = 'resolved',
          resolved_at = NOW(),
          updated_at = NOW()
      WHERE id = $1
        AND resolved = FALSE
      RETURNING *;
    `;

    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.json({ success: false, message: "Complaint not found or already resolved" ,token});
    }

    return res.json({ success: true, data: result.rows[0] ,token});
  } catch (error) {
    console.error("Error resolving complaint:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error",token });
  }
}

export default resolvecomplaints;
