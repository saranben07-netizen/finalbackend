import pool from "../../../database/database.js";

async function fetchstudent(req, res) {
  try {
    // Ensure req.body is always an object
    const body = req.body || {};
    const { token, ...data } = body;

    // Remove null or empty values
    function cleanObject(obj) {
      return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== null && value !== "")
      );
    }

    const cleanedObject = cleanObject(data);

    let query = "SELECT * FROM students";
    const values = [];

    // Add dynamic WHERE clause if there are any filters
    if (Object.keys(cleanedObject).length > 0) {
      const keys = Object.keys(cleanedObject);
      const whereString = keys.map((key, i) => `${key} = $${i + 1}`).join(" AND ");
      values.push(...Object.values(cleanedObject));
      query += ` WHERE ${whereString}`;
    }

    query += " ORDER BY name ASC"; // optional: order by name

    const result = await pool.query(query, values);
    const dataRows = result.rows;

    return res.status(200).json({
      success: true,
      message: dataRows.length > 0 ? "Students fetched successfully" : "No students found",
      count: dataRows.length,
      students: dataRows,
      token: token
    });
  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
}

export default fetchstudent;
