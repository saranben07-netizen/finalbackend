import pool from '../../../database/database.js';

export const fetchMessBills = async (req, res) => {
  const client = await pool.connect();

  try {
    const { year_month, department, registration_number, academic_year } = req.body;

    if (!year_month) {
      return res.status(400).json({ error: "year_month is required" });
    }

    // 1️⃣ Build dynamic filters
    const filters = ['b.month_year = $1'];
    const values = [year_month];
    let idx = 2;

    if (department) {
      filters.push(`s.department = $${idx}`);
      values.push(department);
      idx++;
    }
    if (registration_number) {
      filters.push(`s.registration_number = $${idx}`);
      values.push(registration_number);
      idx++;
    }
    if (academic_year) {
      filters.push(`s.academic_year = $${idx}`);
      values.push(academic_year);
      idx++;
    }

    // 2️⃣ Query with JOINs
    const query = `
      SELECT 
        m.id AS mess_bill_id,
        m.monthly_year_data_id,
        s.id AS student_id,
        s.name,
        s.department,
        s.registration_number,
        s.academic_year,
        m.number_of_days,
        m.status,
        b.month_year,
        b.mess_fee_per_day,
        (b.mess_fee_per_day * m.number_of_days) AS total_amount,
        m.latest_order_id,
        m.show_to_students,
        m.created_at,
        m.updated_at
      FROM public.mess_bill_for_students m
      JOIN public.students s
        ON m.student_id = s.id
      JOIN public.monthly_base_costs b
        ON m.monthly_base_cost_id = b.id
      WHERE ${filters.join(' AND ')}
      ORDER BY s.department, s.academic_year, s.name;
    `;

    const result = await client.query(query, values);

    res.status(200).json({
      message: 'Mess bills fetched successfully',
      count: result.rowCount,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching mess bills:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
