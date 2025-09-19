import isInHostel from "./isinhostel.js";
import pool from "../database/database.js";

async function attendance(req, res) {
  try {
    const studentlat = parseFloat(req.body.lat);
    const studentlng = parseFloat(req.body.lng);
    const id = parseInt(req.body.id);
    

    // Validate inputs
    if (isNaN(studentlat) || isNaN(studentlng) || isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid input" });
    }

    const hostellat = 10.695119265291055;
    const hostellng = 78.97738689667436;

    const isinHostel = isInHostel(studentlat, studentlng, hostellat, hostellng, 500);

    if (!isinHostel) {
      return res.status(403).json({ success: false, error: "Student not inside hostel" });
    }

    // Insert attendance
    const query = `
      INSERT INTO public.attendance (student_id, status)
      VALUES ($1, $2)
      ON CONFLICT (student_id, date) DO NOTHING
      RETURNING *;
    `;
    const result = await pool.query(query, [id, "Present"]);

    if (result.rows.length === 0) {
      return res.json({ success: false, message: "Attendance already marked for today" ,token:req.body.token});
    }

    return res.json({ success: true, attendance: result.rows[0] ,token:req.body.token});
  } catch (err) {
    console.error("Error marking attendance:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

export default attendance;
