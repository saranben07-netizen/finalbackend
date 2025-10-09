import pool from "../../../database/database.js";

async function showattendance(req, res) {
  try {
    const body = req.body || {};
    const { token, from, to, ...data } = body;

    // 🧹 Remove null or empty filter fields
    const cleanedObject = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== null && v !== "")
    );

    // 📋 Attendance table columns
    const attendanceColumns = [
      "id",
      "student_id",
      "date",
      "status",
      "created_at",
      "updated_at"
    ];

    // 📋 Students table columns (excluding "status")
    const studentColumns = [
      "id",
      "name",
      "father_guardian_name",
      "dob",
      "blood_group",
      "student_contact_number",
      "parent_guardian_contact_number",
      "address",
      "department",
      "academic_year",
      "registration_number",
      "roll_number",
      "room_number",
      "email",
      "password",
      "profile_photo",
      "approved_by",
      "created_at",
      "updated_at",
      "deleted_at"
    ];

    // 🏗 Base query
    let query = `
      SELECT 
        a.id AS attendance_id,
        a.student_id,
        a.date,
        a.status,
        a.created_at AS attendance_created_at,
        a.updated_at AS attendance_updated_at,
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
        s.deleted_at AS student_deleted_at
      FROM attendance a
      RIGHT JOIN students s ON a.student_id = s.id
    `;

    const conditions = [];
    const values = [];

    // 🧠 Add dynamic filters with prefixes to avoid conflicts
    Object.entries(cleanedObject).forEach(([key, value]) => {
      if (key.startsWith("attendance_")) {
        const col = key.replace("attendance_", "");
        if (attendanceColumns.includes(col)) {
          conditions.push(`a.${col} = $${values.length + 1}`);
          values.push(value);
        }
      } else if (key.startsWith("student_")) {
        const col = key.replace("student_", "");
        if (studentColumns.includes(col)) {
          conditions.push(`s.${col} = $${values.length + 1}`);
          values.push(value);
        }
      } else {
        console.warn(`⚠️ Ignored unknown or ambiguous filter: ${key}`);
      }
    });

    // 📅 Date range filter (attendance.date)
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

    // 🧩 Add WHERE clause if conditions exist
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // 🧾 Order by student name
    query += ` ORDER BY s.name;`;

    // 🚀 Execute query
    const result = await pool.query(query, values);

    // 📦 Send response
    return res.json({
      success: true,
      data: result.rows,
      token,
      message:
        result.rows.length === 0 ? "No attendance records found" : undefined
    });

  } catch (err) {
    console.error("❌ Error fetching attendance:", err);
    return res.status(500).json({ success: false, error: "Server error", token });
  }
}

export default showattendance;
