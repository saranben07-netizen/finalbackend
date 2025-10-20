import pool from '../../../database/database.js';

export const fetchMessBills = async (req, res) => {
  const client = await pool.connect();

  try {
    const { month_year, department, academic_year } = req.body;

    // 🚫 Mandatory fields check
    if (!month_year || !department || !academic_year) {
      return res.status(400).json({
        error: "month_year, department, and academic_year are required fields."
      });
    }

    // 🧾 Query
    const query = `
      SELECT 
        s.id AS student_id,
        s.name AS student_name,
        s.registration_number,
        s.department,
        s.academic_year,

        mbc.id AS monthly_base_cost_id,
        mbc.month_year AS mess_bill_month,
        mbc.mess_fee_per_day,

        myd.id AS monthly_year_data_id,
        myd.total_days AS total_days_in_month,

        mbfs.id AS mess_bill_id,
        mbfs.status AS payment_status,
       

        -- ✅ Calculated fields
        COALESCE(mbfs.number_of_days, myd.total_days) AS effective_number_of_days,
        COALESCE(mbfs.number_of_days, myd.total_days) * mbc.mess_fee_per_day AS total_amount

      FROM monthly_base_costs mbc
      JOIN monthly_year_data myd 
        ON myd.monthly_base_id = mbc.id
      JOIN students s 
        ON s.academic_year::integer = myd.year
      LEFT JOIN mess_bill_for_students mbfs 
        ON mbfs.monthly_year_data_id = myd.id
        AND mbfs.student_id = s.id
        AND mbfs.monthly_base_cost_id = mbc.id

      WHERE mbc.month_year = $1
        AND s.department = $2
        AND s.academic_year = $3

      ORDER BY s.registration_number;
    `;

    const values = [month_year, department, academic_year];

    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No records found for the given filters.",
        filters: { month_year, department, academic_year }
      });
    }

    res.status(200).json({
      message: "Mess bill data fetched successfully.",
      filters: { month_year, department, academic_year },
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error('Error in fetchMessBills:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
