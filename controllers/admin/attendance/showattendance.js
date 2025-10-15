import pool from "../../../database/database.js";

async function showattendance(req, res) {
  try {
    const { token, registration_number, department, academic_year, date, status } = req.body || {};

    // ✅ Start from students table and LEFT JOIN attendance
    let query = `
      SELECT 
        s.id AS student_id,
        s.name,
        s.department,
        s.academic_year,
        s.registration_number,
        s.roll_number,
        s.room_number,
        s.email,
        s.approved_by,
        s.created_at AS student_created_at,
        s.updated_at AS student_updated_at,
        s.deleted_at AS student_deleted_at,
        a.id AS attendance_id,
        a.date AS attendance_date,
        a.status AS attendance_status,
        a.created_at AS attendance_created_at,
        a.updated_at AS attendance_updated_at
      FROM students s
    `;

    // 🧩 Build dynamic JOIN conditionsnnode 
    const joinConditions = ["a.student_id = s.id"];
    const values = [];
    let paramIndex = 1;

    if (date && date.trim() !== "") {
      joinConditions.push(`a.date = $${paramIndex++}`);
      values.push(new Date(date).toISOString().split("T")[0]);
    }

    if (status && status.trim() !== "") {
      joinConditions.push(`a.status = $${paramIndex++}`);
      values.push(status);
    }

    // 🧠 Apply LEFT JOIN with dynamic conditions
    query += ` LEFT JOIN attendance a ON ${joinConditions.join(" AND ")}`;

    // 🎯 Student-based filters
    const whereConditions = [];

    if (department && department.trim() !== "") {
      whereConditions.push(`s.department = $${paramIndex++}`);
      values.push(department);
    }

    if (academic_year && academic_year.trim() !== "") {
      whereConditions.push(`s.academic_year = $${paramIndex++}`);
      values.push(academic_year);
    }

    if (registration_number && registration_number.trim() !== "") {
      whereConditions.push(`s.registration_number = $${paramIndex++}`);
      values.push(registration_number);
    }

    // 🧾 Apply WHERE clause only if needed
    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(" AND ")}`;
    }

    // 🗂️ Sort results
    query += ` ORDER BY s.name;`;

    console.log("🧩 Final Query:", query);
    console.log("📦 Values:", values);

    // 🚀 Execute query
    const result = await pool.query(query, values);

    // 📤 Send response
    return res.json({
      success: true,
      data: result.rows,
      token,
      message: result.rows.length === 0 ? "No attendance records found" : undefined,
    });

  } catch (err) {
    console.error("❌ Error fetching attendance:", err);
    return res.status(500).json({ success: false, error: "Server error", token });
  }
}

export default showattendance;
