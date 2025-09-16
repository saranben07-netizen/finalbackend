import pool from "../database/database.js";

async function registercomplaint(req, res) {
  try {
    const { id: student_id, title, description, category, priority } = req.body;
    console.log("yes");
  
    const data1 = await pool.query(`SELECT year , department from students where id=$1`,[student_id]);
  
    const year = data1.rows[0].year;
    const department = data1.rows[0].department;
    console.log(year);
    console.log(department);

    const result = await pool.query(
      `INSERT INTO complaints (student_id, title, description, category, priority,year,department)
       VALUES ($1, $2, $3, $4, $5,$6,$7)
       RETURNING *`,  // return the inserted row
      [student_id, title, description, category, priority,year,department]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ success: false, message: "Complaint not registered" });
    }

    return res.json({
      success: true,
      message: "Complaint registered successfully",
      complaint: result.rows[0], // send back inserted complaint
    });

  } catch (err) {
    console.error("Error registering complaint:", err.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export default registercomplaint;
