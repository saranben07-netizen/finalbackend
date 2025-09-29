import pool from "../../../database/database.js";

async function showattendance(req, res) {
  try {
    // Ensure req.body is always an object
    const body = req.body || {};
    const { token, from, to, ...data } = body;

    // Remove null or empty values from other filters
    function cleanObject(obj) {
      return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== null && value !== "")
      );
    }

    const cleanedObject = cleanObject(data);

    let query = `
      SELECT a.id as attendance_id, a.date, a.status, 
             s.id as student_id, s.name, s.department, s.academic_year
      FROM attendance a
      INNER JOIN students s ON a.student_id = s.id
    `;

    const conditions = [];
    const values = [];

    // Add dynamic filters from cleanedObject
    Object.keys(cleanedObject).forEach((key, idx) => {
      conditions.push(`${key} = $${idx + 1}`);
      values.push(cleanedObject[key]);
    });

    // Add date filter if from/to provided
    if (from) {
      const fromDate = new Date(from).toISOString().split("T")[0];
      conditions.push(`a.date >= $${values.length + 1}`);
      values.push(fromDate);
    }

    if (to) {
      const toDate = new Date(to).toISOString().split("T")[0];
      conditions.push(`a.date <= $${values.length + 1}`);
      values.push(toDate);
    }

    // Append WHERE clause only if there are any conditions
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY s.name;`;

    const result = await pool.query(query, values);

    return res.json({
      success: true,
      data: result.rows,
      token,
      message: result.rows.length === 0 ? "No attendance records found" : undefined
    });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

export default showattendance;
