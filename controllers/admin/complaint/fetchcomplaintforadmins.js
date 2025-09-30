import pool from "../../../database/database.js";

async function fetchcomplaintforadmins(req, res) {
  try {
    console.log("Fetching complaints for admins...");

    const { token, ...data } = req.body;

    // Utility to remove null/empty values
    const cleanObject = (obj) =>
      Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== null && value !== "")
      );

    const filters = cleanObject(data);

    if (Object.keys(filters).length === 0) {
        const query1 = `SELECT * FROM complaints`;
         const result1 = await pool.query(query1);

         return res.json({
      success: true,
      count: result1.rowCount,
      data: result1.rows,token
    });
      
    }

    // Build WHERE clause dynamically
    const keys = Object.keys(filters);
    const values = Object.values(filters);
    const whereClause = keys.map((key, i) => `${key} = $${i + 1}`).join(" AND ");

    const query = `SELECT * FROM complaints WHERE ${whereClause}`;
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.json({
        success: false,
        message: "No complaints found",token
      });
    }

    return res.json({
      success: true,
      count: result.rowCount,
      data: result.rows,token
    });

  } catch (err) {
    console.error("Error fetching complaints for admins:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",token
    });
  }
}

export default fetchcomplaintforadmins;
