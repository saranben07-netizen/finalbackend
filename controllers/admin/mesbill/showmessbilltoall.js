import pool from '../../../database/database.js';

export const updateShowFlagByMonthYear = async (req, res) => {
  const client = await pool.connect();

  try {
    const { month_year } = req.body;

    // ✅ Basic validation
    if (!month_year) {
      return res.status(400).json({
        error: 'month_year (string) is required.'
      });
    }

    // ✅ Get monthly_base_cost record
    const baseResult = await client.query(
      `SELECT id FROM monthly_base_costs WHERE month_year = $1`,
      [month_year]
    );

    if (baseResult.rows.length === 0) {
      return res.status(404).json({ error: 'month_year not found.' });
    }

    const { id: monthly_base_cost_id } = baseResult.rows[0];

    // ✅ Check verification status for all students
    const verifyCheck = await client.query(
      `SELECT COUNT(*) FILTER (WHERE verified = false OR verified IS NULL) AS unverified_count,
              COUNT(*) AS total_count
         FROM mess_bill_for_students
        WHERE monthly_base_cost_id = $1`,
      [monthly_base_cost_id]
    );

    const { unverified_count, total_count } = verifyCheck.rows[0];

    if (parseInt(total_count) === 0) {
      return res.status(404).json({
        message: `❌ No student records found for month_year '${month_year}'.`
      });
    }

    if (parseInt(unverified_count) > 0) {
      return res.status(400).json({
        message: `❌ Cannot update show flag. Only ${
          total_count - unverified_count
        } of ${total_count} students are verified.`,
        hint: 'All students must be verified before showing.'
      });
    }

    // ✅ All verified → update show = true
    const updateResult = await client.query(
      `UPDATE mess_bill_for_students
          SET show = true,
              updated_at = NOW()
        WHERE monthly_base_cost_id = $1
        RETURNING id, student_id, show;`,
      [monthly_base_cost_id]
    );

    return res.status(200).json({
      message: `✅ All ${total_count} students are verified — show flag set to true for ${updateResult.rowCount} records.`,
      data: updateResult.rows
    });

  } catch (error) {
    console.error('❌ Error updating show flag:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  } finally {
    client.release();
  }
};
