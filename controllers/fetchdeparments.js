import { Result } from "pg";
import pool from "../database/database.js";

async function fetchdepartments(req, res) {
  try {
    const result = await pool.query(`SELECT * FROM departments`);
    
    // ✅ Convert rows into list of strings
    

    return res.json({ success: true, result: result.rows });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return res.status(500).json({ success: false, message: "Internal server error"});
  }
}

export default fetchdepartments;
