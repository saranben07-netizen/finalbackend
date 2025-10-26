import pool from '../../../database/database.js';

const bulkUpdateShowForMessBills = async (req, res) => {
  const client = await pool.connect();

  try {
    const { month_year, year, department, show } = req.body;

    // 🚫 Validation
    if (!month_year || typeof show !== 'boolean') {
      return res.status(400).json({
        error: "Fields 'month_year' and boolean 'show' are required.",
      });
    }

    // 🧾 Subquery to safely filter records
    let subQuery = `
      SELECT mbfs.id
      FROM mess_bill_for_students mbfs
      JOIN monthly_base_costs mb ON mbfs.monthly_base_cost_id = mb.id
      JOIN monthly_year_data myd ON mbfs.monthly_year_data_id = myd.id
      JOIN students s ON s.id = mbfs.student_id
      WHERE mb.month_year = $1
    `;

    const params = [month_year];
    let paramIndex = 2;

    if (year) {
      subQuery += ` AND myd.year = $${paramIndex++}`;
      params.push(year);
    }

    if (department) {
      subQuery += ` AND s.department = $${paramIndex++}`;
      params.push(department);
    }

    // 🧾 Update using the subquery
    const updateQuery = `
      UPDATE mess_bill_for_students
      SET show = $${paramIndex}, updated_at = NOW()
      WHERE id IN (${subQuery})
      RETURNING id, student_id, show;
    `;

    params.push(show);

    const result = await client.query(updateQuery, params);

    return res.status(200).json({
      message: `✅ Updated 'show' = ${show} for ${result.rowCount} record(s) in ${month_year}.`,
      filters: { month_year, year, department },
      updated_records: result.rows,
    });

  } catch (error) {
    console.error("❌ Error updating show flag for mess bills:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export default bulkUpdateShowForMessBills;
