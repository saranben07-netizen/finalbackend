import pool from '../../../database/database.js'; // adjust path

const updateShowToStudentsByDeptYear = async (req, res) => {
  const client = await pool.connect();

  try {
    const { year, department, show_to_students } = req.body;

    // Validation
    if (typeof show_to_students !== "boolean") {
      return res.status(400).json({ error: "show_to_students(boolean) is required" });
    }

    if (!year && !department) {
      return res.status(400).json({ error: "At least one filter (year or department) must be provided" });
    }

    // Base query
    let query = `
      UPDATE mess_bill_for_students mbs
      SET show_to_students = $1,
          updated_at = NOW()
      FROM students s
      WHERE mbs.student_id = s.id
    `;

    const values = [show_to_students];
    let count = 2; // $1 is used for show_to_students

    // Apply filters dynamically
    if (year && department) {
      query += ` AND s.academic_year = $${count++} AND s.department = $${count++}`;
      values.push(year, department);
    } else if (year) {
      query += ` AND s.academic_year = $${count++}`;
      values.push(year);
    } else if (department) {
      query += ` AND s.department = $${count++}`;
      values.push(department);
    }

    query += `
      RETURNING mbs.id, s.name, s.department, s.academic_year, s.registration_number, mbs.show_to_students
    `;

    const { rows } = await client.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No records found for the given filters" });
    }

    return res.status(200).json({
      message: "show_to_students updated successfully",
      updated_records: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Error updating show_to_students by department/year:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};

export default updateShowToStudentsByDeptYear