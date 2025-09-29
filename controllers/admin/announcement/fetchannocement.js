import pool from "../../../database/database.js";

async function fetchannocement(req, res) {
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

    let query = `SELECT * FROM annocements`;
    const values = [];

    if (Object.keys(cleanedObject).length > 0) {
      const keys = Object.keys(cleanedObject);
      const whereString = keys.map((key, i) => `${key} = $${i + 1}`).join(" AND ");
      values.push(...Object.values(cleanedObject));
      query += ` WHERE ${whereString}`;
    }

    query += ` ORDER BY created_at DESC`; // optional: latest announcements first

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        message: "No announcements found",
        announcements: [],
        token,
      });
    }

    return res.json({
      success: true,
      announcements: result.rows,
      token,
    });

  } catch (error) {
    console.error("Error fetching announcements:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching announcements",
    });
  }
}

export default fetchannocement;
