import pool from '../../../database/database.js';

export const upsertSingleMessBill = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      student_id,
      monthly_base_cost_id,
      monthly_year_data_id,
      mess_bill_id,
      number_of_days,
      status
    } = req.body;

    // ✅ Validate mandatory fields
    if (!student_id || !monthly_base_cost_id || !monthly_year_data_id) {
      return res.status(400).json({
        error: "student_id, monthly_base_cost_id, and monthly_year_data_id are required."
      });
    }

    await client.query('BEGIN');

    let result;

    // ✅ UPSERT logic (insert or update on conflict)
    const upsertQuery = `
      INSERT INTO mess_bill_for_students (
        student_id, monthly_base_cost_id, monthly_year_data_id, number_of_days, status
      )
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (student_id, monthly_base_cost_id)
      DO UPDATE SET
        monthly_year_data_id = EXCLUDED.monthly_year_data_id,
        number_of_days = EXCLUDED.number_of_days,
        status = EXCLUDED.status,
        updated_at = NOW()
      RETURNING id;
    `;

    result = await client.query(upsertQuery, [
      student_id,
      monthly_base_cost_id,
      monthly_year_data_id,
      number_of_days ?? 30,
      status ?? 'PENDING'
    ]);

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Mess bill inserted or updated successfully.',
      mess_bill_id: result.rows[0].id
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in upsertSingleMessBill:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
