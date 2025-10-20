import pool from '../../../database/database.js';

export const updateMonthlyCalculation = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { base_id, years_data, ...fields } = req.body;
    if (!base_id) return res.status(400).json({ error: "base_id is required" });

    // 1️⃣ Dynamically update monthly_base_costs
    const baseFields = [
      'month_year', 'grocery_cost', 'vegetable_cost', 'gas_charges',
      'total_milk_litres', 'milk_cost_per_litre', 'milk_charges_computed',
      'other_costs', 'deductions_income', 'veg_extra_per_day', 'nonveg_extra_per_day',
      'total_expenditure', 'expenditure_after_income', 'mess_fee_per_day'
    ];

    const setClauses = [];
    const values = [];
    let idx = 1;

    baseFields.forEach(field => {
      if (fields[field] !== undefined && fields[field] !== "") {
        setClauses.push(`${field} = $${idx}`);
        values.push(fields[field]);
        idx++;
      }
    });

    if (setClauses.length > 0) {
      const updateQuery = `
        UPDATE public.monthly_base_costs
        SET ${setClauses.join(', ')}
        WHERE id = $${idx}
        RETURNING month_year, mess_fee_per_day;
      `;
      values.push(base_id);
      const updatedBase = await client.query(updateQuery, values);
      if (!updatedBase.rows.length) throw new Error('Base record not found');

      fields.month_year = updatedBase.rows[0].month_year;
      fields.mess_fee_per_day = updatedBase.rows[0].mess_fee_per_day;
    } else {
      const resBase = await client.query(
        `SELECT month_year, mess_fee_per_day FROM public.monthly_base_costs WHERE id = $1`,
        [base_id]
      );
      fields.month_year = resBase.rows[0].month_year;
      fields.mess_fee_per_day = resBase.rows[0].mess_fee_per_day;
    }

    // 2️⃣ Upsert per-year data
    if (Array.isArray(years_data)) {
      for (const y of years_data) {
        const year = y.year;
        const total_students = y.total_students ?? 0;
        const total_days = y.total_days ?? 0;

        await client.query(`
          INSERT INTO public.monthly_year_data (monthly_base_id, year, total_students, total_days)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (monthly_base_id, year)
          DO UPDATE SET total_students = EXCLUDED.total_students,
                        total_days = EXCLUDED.total_days;
        `, [base_id, year, total_students, total_days]);
      }
    }

    // 3️⃣ 🚮 Delete ALL mess bills for this base_id
    await client.query(`
      DELETE FROM public.mess_bill_for_students
      WHERE monthly_base_cost_id = $1;
    `, [base_id]);

    await client.query('COMMIT');

    res.status(200).json({
      message: 'Monthly calculation updated successfully (all related mess bills deleted)',
      base_id,
      updated_month: fields.month_year
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating monthly calculation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
