import pool from '../../../database/database.js';

const bulkGenerateMessBillsFromYearMonth = async (req, res) => {
  const client = await pool.connect();

  try {
    const { month_year, year, department } = req.body;

    if (!month_year) {
      return res.status(400).json({ error: "month_year is required." });
    }

    let insertQuery = `
      INSERT INTO mess_bill_for_students
        (student_id, monthly_base_cost_id, monthly_year_data_id, number_of_days)
      SELECT
        s.id,
        mb.id AS monthly_base_cost_id,
        myd.id AS monthly_year_data_id,
        myd.total_days AS number_of_days
      FROM monthly_base_costs mb
      JOIN monthly_year_data myd
        ON myd.monthly_base_id = mb.id
      JOIN students s
        ON s.academic_year::int = myd.year
      WHERE mb.month_year = $1
    `;

    const params = [month_year];
    let paramIndex = 2;

    if (year) {
      insertQuery += ` AND myd.year = $${paramIndex++}`;
      params.push(year);
    }

    if (department) {
      insertQuery += ` AND s.department = $${paramIndex++}`;
      params.push(department);
    }

    insertQuery += `
      ON CONFLICT (student_id, monthly_base_cost_id, monthly_year_data_id)
      DO NOTHING
      RETURNING id, student_id
    `;

    const result = await client.query(insertQuery, params);

    res.status(200).json({
      message: `Mess bills inserted successfully (existing bills skipped) for ${result.rowCount} students for ${month_year}.`,
      inserted: result.rows
    });

  } catch (error) {
    console.error("Error generating bulk mess bills from year/month:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};

export default bulkGenerateMessBillsFromYearMonth;
