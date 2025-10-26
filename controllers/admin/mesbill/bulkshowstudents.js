import pool from '../../../database/database.js';

const bulkUpdateShowForMessBills = async (req, res) => {
  const client = await pool.connect();

  try {
    const { month_year, year, department, show } = req.body;

    // 🚫 Input validation
    if (!month_year || typeof show !== 'boolean') {
      return res.status(400).json({
        error: "Fields 'month_year' and boolean 'show' are required.",
      });
    }

    // 🧾 Base query
    let updateQuery = `
      UPDATE mess_bill_for_students AS mbfs
      SET 
        show = $1,
        updated_at = NOW()
      FROM monthly_base_costs AS mb
      INNER JOIN monthly_year_data AS myd
        ON myd.monthly_base_id = mb.id
      INNER JOIN students AS s
        ON s.id = mbfs.student_id
      WHERE 
        mbfs.monthly_base_cost_id = mb.id
        AND mbfs.monthly_year_data_id = myd.id
        AND mb.month_year = $2
    `;

    const params = [show, month_year];
    let paramIndex = 3;

    // 🧩 Optional filters
    if (year) {
      updateQuery += ` AND myd.year = $${paramIndex++}`;
      params.push(year);
    }

    if (department) {
      updateQuery += ` AND s.department = $${paramIndex++}`;
      params.push(department);
    }

    updateQuery += ` RETURNING mbfs.id, mbfs.student_id, mbfs.show;`;

    // 🔥 Execute query
    const result = await client.query(updateQuery, params);

    // ✅ Success response
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
