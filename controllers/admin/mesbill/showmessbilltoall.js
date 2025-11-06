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

    // ✅ Get monthly_base_cost record
    const baseResult = await client.query(
      `SELECT id, progress_stage 
         FROM monthly_base_costs 
        WHERE month_year = $1`,
      [month_year]
    );

    if (baseResult.rows.length === 0) {
      return res.status(404).json({ error: 'month_year not found.' });
    }

    const { id: monthly_base_cost_id, progress_stage } = baseResult.rows[0];

    // ✅ If show = false → allow anytime (no verification restriction)
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

    // ✅ If trying to set show = true, ensure progress_stage = 'FULLY_VERIFIED'
    if (progress_stage !== 'FULLY_VERIFIED') {
      return res.status(400).json({
        message: `❌ Cannot update show flag. The progress_stage for '${month_year}' is '${progress_stage}'.`,
        hint: 'Only FULLY_VERIFIED months are allowed to show.'
      });
    }

    // ✅ All verified — update show flag to true
    const updateResult = await client.query(
      `UPDATE mess_bill_for_students
          SET show = true,
              updated_at = NOW()
        WHERE monthly_base_cost_id = $1
        RETURNING id, student_id, show;`,
      [monthly_base_cost_id]
    );

    return res.status(200).json({
      message: `✅ Month '${month_year}' is FULLY_VERIFIED — show flag updated for ${updateResult.rowCount} records.`,
      data: updateResult.rows
    });

  } catch (error) {
    console.error('❌ Error updating show flag:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  } finally {
    client.release();
  }
};
