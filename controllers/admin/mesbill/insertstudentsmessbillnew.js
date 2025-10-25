import pool from '../../../database/database.js';

export const upsertSingleMessBill = async (req, res) => {
  const client = await pool.connect();

  try {
    const { student_id, monthly_base_cost_id, monthly_year_data_id, mess_bill_id, number_of_days, status } = req.body;

    // ✅ Mandatory fields check
    if (!student_id || !monthly_base_cost_id || !monthly_year_data_id) {
      return res.status(400).json({
        error: "student_id, monthly_base_cost_id, and monthly_year_data_id are required."
      });
    }

    await client.query('BEGIN');

    let result;

    if (!mess_bill_id) {
      // ➕ Insert new record with ON CONFLICT DO NOTHING
      const insertQuery = `
        INSERT INTO mess_bill_for_students (
          student_id,
          monthly_base_cost_id,
          monthly_year_data_id,
          number_of_days,
          status,
          show
        )
        VALUES ($1, $2, $3, $4, $5, true)
        ON CONFLICT (student_id, monthly_base_cost_id, monthly_year_data_id) DO NOTHING
        RETURNING id;
      `;
      result = await client.query(insertQuery, [
        student_id,
        monthly_base_cost_id,
        monthly_year_data_id,
        number_of_days ?? 30,
        status ?? 'PENDING'
      ]);

      if (result.rows.length === 0) {
        // Conflict occurred — nothing inserted
        await client.query('COMMIT');
        return res.status(200).json({
          message: 'Mess bill already exists. No new record inserted.',
          mess_bill_id: null
        });
      }
    } else {
      // ♻️ Update existing record
      const updateQuery = `
        UPDATE mess_bill_for_students
        SET
          number_of_days = $1,
          status = $2,
          updated_at = NOW(),
          show = true
        WHERE id = $3
        RETURNING id;
      `;
      result = await client.query(updateQuery, [
        number_of_days ?? 30,
        status ?? 'PENDING',
        mess_bill_id
      ]);
    }

    await client.query('COMMIT');

    res.status(200).json({
      message: mess_bill_id ? 'Mess bill updated successfully.' : 'Mess bill inserted successfully.',
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
