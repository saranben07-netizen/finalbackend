import pool from '../../../database/database.js';

export const updateNumberOfDays = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      student_id,
      monthly_base_cost_id,
      monthly_year_data_id,
      number_of_days
    } = req.body;

    // 🚫 Validate inputs
    if (!student_id || !monthly_base_cost_id || !monthly_year_data_id) {
      return res.status(400).json({
        error: "student_id, monthly_base_cost_id, and monthly_year_data_id are required."
      });
    }

    if (number_of_days === undefined || isNaN(number_of_days)) {
      return res.status(400).json({
        error: "A valid 'number_of_days' value is required."
      });
    }

    // 🧾 Update query
    const query = `
      UPDATE public.mess_bill_for_students
      SET number_of_days = $1,
          updated_at = NOW()
      WHERE student_id = $2
        AND monthly_base_cost_id = $3
        AND monthly_year_data_id = $4
      RETURNING *;
    `;

    const values = [number_of_days, student_id, monthly_base_cost_id, monthly_year_data_id];
    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "No matching mess bill found for the provided identifiers.",
        identifiers: { student_id, monthly_base_cost_id, monthly_year_data_id }
      });
    }

    res.status(200).json({
      message: "Number of days updated successfully.",
      updated_record: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error in updateNumberOfDays:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
