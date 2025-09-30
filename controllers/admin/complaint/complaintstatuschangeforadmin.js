import pool from "../../../../database/database.js";

async function complaintstatuschangeforadmin(req, res) {
  try {
    const { complaint_id, status,token } = req.body;

    if (!complaint_id || !status) {
      return res.status(400).json({ success: false, message: "complaint_id and status are required",token });
    }

    const result = await pool.query(
      "UPDATE complaints SET status = $1 WHERE id = $2",
      [status, complaint_id]
    );

    if (result.rowCount > 0) {
      return res.json({ success: true, message: "Updated successfully" ,status ,token});
    } else {
      return res.status(404).json({ success: false, message: "Complaint not found",token });
    }
  } catch (error) {
    console.error("Error updating complaint status:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error",token });
  }
}

export default complaintstatuschangeforadmin;
