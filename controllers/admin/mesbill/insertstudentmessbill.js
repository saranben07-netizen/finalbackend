import pool from '../../../database/database.js'; // adjust path

export const insertMessBillForMonth = async (req, res) => {
  const client = await pool.connect();

  try {
    const { month_year, years } = req.body; // years = [1,2,3,4]

    if (!month_year || !Array.isArray(years)) {
      return res.status(400).json({ error: "month_year and years array are required" });
    }

    await client.query('BEGIN'); // Start transaction

    // Insert mess bills dynamically for selected years
    const insertQuery = `
      INSERT INTO public.mess_bill_for_students
        (student_id, amount, year_month, monthly_year_data_id, number_of_days, monthly_base_cost_id)
      SELECT 
        s.id AS student_id,
        (COALESCE(m.per_day_amount, 0) * COALESCE(m.total_days, 30)) AS amount,
        b.month_year AS year_month,
        m.id AS monthly_year_data_id,
        COALESCE(m.total_days, 30) AS number_of_days,
        b.id AS monthly_base_cost_id
      FROM public.students s
      JOIN public.monthly_year_data m
        ON s.academic_year::int = m.year
      JOIN public.monthly_base_costs b
        ON m.monthly_base_id = b.id
      WHERE b.month_year = $1
        AND m.year = ANY($2::int[])
      ON CONFLICT (student_id, year_month) DO NOTHING
      RETURNING *;
    `;

    const result = await client.query(insertQuery, [month_year, years]);

    await client.query('COMMIT');

    res.status(201).json({
      message: `Mess bills inserted successfully for month ${month_year}`,
      inserted_count: result.rowCount,
      inserted_rows: result.rows
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting mess bills:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
