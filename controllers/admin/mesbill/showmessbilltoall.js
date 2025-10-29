import pool from '../../../database/database.js';

export const updateShowFlagByMonthYear = async (req, res) => {
  const client = await pool.connect();

  try {
    const { month_year, show } = req.body;

    // ✅ Basic validation
    if (!month_year || typeof show !== 'boolean') {
      return res.status(400).json({
        error: 'month_year (string) and show (boolean) are required.'
      });
    }

    // ✅ Get monthly_base_cost_id
    const baseResult = await client.query(
      `SELECT id FROM monthly_base_costs WHERE month_year = $1`,
      [month_year]
    );

    if (baseResult.rows.length === 0) {
      return res.status(404).json({ error: 'month_year not found.' });
    }

    const monthly_base_cost_id = baseResult.rows[0].id;

    // ✅ If show = false → always update (no verification check)
    if (show === false) {
      const updateResult = await client.query(
        `UPDATE mess_bill_for_students
           SET show = false,
               updated_at = NOW()
         WHERE monthly_base_cost_id = $1
         RETURNING id, student_id, show;`,
        [monthly_base_cost_id]
      );

      return res.status(200).json({
        message: `✅ Show flag set to false for ${updateResult.rowCount} records.`,
        data: updateResult.rows
      });
    }

    // ✅ Check using SQL: Are there any unverified records?
    const unverifiedResult = await client.query(
      `SELECT id, student_id
         FROM mess_bill_for_students
        WHERE monthly_base_cost_id = $1
          AND verified = false;`,
      [monthly_base_cost_id]
    );

    // ❌ If any unverified record exists, abort update
    if (unverifiedResult.rows.length > 0) {
      return res.status(400).json({
        message: '❌ Update aborted — some records are not verified.',
        notVerifiedCount: unverifiedResult.rowCount,
        notVerifiedRecords: unverifiedResult.rows
      });
    }

    // ✅ All verified — update show flag
    const updateResult = await client.query(
      `UPDATE mess_bill_for_students
         SET show = true,
             updated_at = NOW()
       WHERE monthly_base_cost_id = $1
       RETURNING id, student_id, show;`,
      [monthly_base_cost_id]
    );

    return res.status(200).json({
      message: `✅ All records verified — show flag updated successfully for ${updateResult.rowCount} records.`,
      data: updateResult.rows
    });

  } catch (error) {
    console.error('❌ Error updating show flag:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  } finally {
    client.release();
  }
};
