import pool from '../../../database/database.js';

export const fetchMonthlyCalculations = async (req, res) => {
  const client = await pool.connect();

  try {
    // 1️⃣ Fetch base costs with exactly 4 years per month
    const query = `
      SELECT 
        b.id AS monthly_base_costs_id,
        b.month_year,
        b.grocery_cost,
        b.vegetable_cost,
        b.gas_charges,
        b.total_milk_litres,
        b.milk_cost_per_litre,
        b.milk_charges_computed,
        b.other_costs,
        b.deductions_income,
        b.veg_extra_per_day,
        b.nonveg_extra_per_day,
        b.total_expenditure,
        b.expenditure_after_income,
        b.mess_fee_per_day,
        b.created_at,
        all_years.year,
        y.total_students,
        y.total_days
      FROM public.monthly_base_costs b
      CROSS JOIN (VALUES (1),(2),(3),(4)) AS all_years(year)
      LEFT JOIN public.monthly_year_data y
        ON y.monthly_base_id = b.id AND y.year = all_years.year
      ORDER BY b.created_at DESC, all_years.year;
    `;

    const result = await client.query(query);

    // 2️⃣ Group by month (monthly_base_costs_id)
    const grouped = {};
    result.rows.forEach(row => {
      const id = row.monthly_base_costs_id;

      if (!grouped[id]) {
        grouped[id] = {
          monthly_base_costs_id: row.monthly_base_costs_id,
          month_year: row.month_year,
          grocery_cost: row.grocery_cost,
          vegetable_cost: row.vegetable_cost,
          gas_charges: row.gas_charges,
          total_milk_litres: row.total_milk_litres,
          milk_cost_per_litre: row.milk_cost_per_litres,
          milk_charges_computed: row.milk_charges_computed,
          other_costs: row.other_costs,
          deductions_income: row.deductions_income,
          veg_extra_per_day: row.veg_extra_per_day,
          nonveg_extra_per_day: row.nonveg_extra_per_day,
          total_expenditure: row.total_expenditure,
          expenditure_after_income: row.expenditure_after_income,
          mess_fee_per_day: row.mess_fee_per_day,
          created_at: row.created_at,
          years_data: []
        };
      }

      grouped[id].years_data.push({
        year: row.year,
        total_students: row.total_students,
        total_days: row.total_days
      });
    });

    const finalResult = Object.values(grouped);

    res.status(200).json({
      message: 'Monthly calculations fetched successfully',
      data: finalResult
    });

  } catch (error) {
    console.error('Error fetching monthly calculations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
