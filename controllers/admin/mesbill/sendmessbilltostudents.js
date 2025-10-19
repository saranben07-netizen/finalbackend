import pool from '../../../database/database.js'; // adjust path

const updateShowToStudentsByDeptYear = async (req, res) => {
  const client = await pool.connect();

  try {
    const { year, department, mess_bill_ids, show_to_students, month_year } = req.body;

    // 1️⃣ Validate show_to_students
    if (typeof show_to_students !== "boolean") {
      return res.status(400).json({ error: "show_to_students (boolean) is required" });
    }

    // 2️⃣ Validate month_year
    if (!month_year) {
      return res.status(400).json({ error: "month_year is required" });
    }

    // 3️⃣ Check invalid combinations
    const hasMessBillIds = Array.isArray(mess_bill_ids) && mess_bill_ids.length > 0;

    if (hasMessBillIds && (year || department)) {
      return res.status(400).json({
        error: "Provide either mess_bill_ids OR (year/department), not both.",
      });
    }

    if (!hasMessBillIds && !year && !department) {
      return res.status(400).json({
        error: "Provide either mess_bill_ids or at least one of year/department.",
      });
    }

    // 4️⃣ Build query dynamically
    let query = `UPDATE mess_bill_for_students mbs
                 SET show_to_students = $1,
                     updated_at = NOW()
                 WHERE mbs.id = mbs.id`; // dummy condition to simplify ANDs

    const values = [show_to_students];
    let count = 2;

    // 5️⃣ Filter by specific mess_bill_ids
    if (hasMessBillIds) {
      const placeholders = mess_bill_ids.map((_, i) => `$${count + i}`).join(", ");
      query += ` AND mbs.id IN (${placeholders})`;
      values.push(...mess_bill_ids);
      count += mess_bill_ids.length;
    } else {
      // 6️⃣ Filter by month_year via monthly_base_costs
      query += ` AND mbs.monthly_base_cost_id IN (
                   SELECT id FROM monthly_base_costs WHERE month_year = $${count++}
                 )`;
      values.push(month_year);

      // 7️⃣ Filter by students
      const studentConditions = [];
      if (year) {
        studentConditions.push(`academic_year = $${count++}`);
        values.push(year);
      }
      if (department) {
        studentConditions.push(`department = $${count++}`);
        values.push(department);
      }
      if (studentConditions.length > 0) {
        query += ` AND student_id IN (
                     SELECT id FROM students WHERE ${studentConditions.join(" AND ")}
                   )`;
      }
    }

    // 8️⃣ Return updated rows
    query += ` RETURNING mbs.id, mbs.student_id, mbs.show_to_students`;

    const { rows } = await client.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No records found for the given criteria." });
    }

    return res.status(200).json({
      message: "show_to_students updated successfully.",
      updated_records: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Error updating show_to_students:", error);
    return res.status(500).json({ error: "Internal server error." });
  } finally {
    client.release();
  }
};

export default updateShowToStudentsByDeptYear;
