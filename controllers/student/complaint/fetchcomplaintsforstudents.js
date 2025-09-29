import pool from "../../../database/database.js";

async function fetchcomplaintsforstudents(req, res) {
  const { id } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM complaints WHERE student_id = $1",
      [id]
    );

    console.log(result);

    return res.json({
      success: result.rows && result.rows.length > 0,
      data: result.rows || [],
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export default fetchcomplaintsforstudents;
