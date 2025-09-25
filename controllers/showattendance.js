import pool from "../database/database.js";

async function showattendance(req, res) {
  try {
    const { token, ...data } = req.body;

    // Remove null or empty values
    function cleanObject(obj) {
      return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== null && value !== "")
      );
    }

    const cleanedObject = cleanObject(data);

    if (Object.keys(cleanedObject).length === 0) {
     
       const query = `
      SELECT a.id as attendance_id, a.date, a.status, 
             s.id as student_id, s.name, s.department, s.academic_year
      FROM attendance a
      INNER JOIN students s
      ON a.student_id = s.id
      ORDER BY s.name;
    `;

        const result = await pool.query(query);
        return res.json({ success: true, data: result.rows ,token});

    }

    const keys = Object.keys(cleanedObject);
    const values = Object.values(cleanedObject);

    // Generate dynamic WHERE clause
    const whereString = keys.map((key, i) => `${key} = $${i + 1}`).join(" AND ");

    const query = `
      SELECT a.id as attendance_id, a.date, a.status, 
             s.id as student_id, s.name, s.department, s.academic_year
      FROM attendance a
      INNER JOIN students s
      ON a.student_id = s.id
      WHERE ${whereString}
      ORDER BY s.name;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.json({ success: true, message: "No attendance records found", data: [],token });
    }

    return res.json({ success: true, data: result.rows ,token});
  } catch (err) {
    console.error("Error fetching attendance:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

export default showattendance;
