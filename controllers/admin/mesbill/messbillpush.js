import pool from '../../../database/database.js'; // adjust path

export const createMonthlyCalculation = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start transaction

    const {
      month_year,
      grocery_cost,
      vegetable_cost,
      gas_charges,
      total_milk_litres,
      milk_cost_per_litre,
      milk_charges_computed,
      other_costs,
      deductions_income,
      veg_extra_per_day,
      nonveg_extra_per_day,
      total_expenditure,
      expenditure_after_income,
      mess_fee_per_day,
      years_data // Array of objects: { year, total_students, total_days }
    } = req.body;

    if (!month_year || !Array.isArray(years_data)) {
      return res.status(400).json({ error: "month_year and years_data array are required" });
    }

    // 1️⃣ Insert into monthly_base_costs
    const baseQuery = `
      INSERT INTO public.monthly_base_costs (
        month_year, grocery_cost, vegetable_cost, gas_charges,
        total_milk_litres, milk_cost_per_litre, milk_charges_computed,
        other_costs, deductions_income, veg_extra_per_day, nonveg_extra_per_day,
        total_expenditure, expenditure_after_income, mess_fee_per_day
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING id;
    `;

    const baseValues = [
      month_year,
      grocery_cost,
      vegetable_cost,
      gas_charges,
      total_milk_litres,
      milk_cost_per_litre,
      milk_charges_computed,
      other_costs,
      deductions_income,
      veg_extra_per_day,
      nonveg_extra_per_day,
      total_expenditure,
      expenditure_after_income,
      mess_fee_per_day
    ];

    const baseResult = await client.query(baseQuery, baseValues);
    const baseId = baseResult.rows[0].id;

    // 2️⃣ Insert monthly_year_data dynamically for years_data array
    const yearQuery = `
      INSERT INTO public.monthly_year_data
        (monthly_base_id, year, total_students, total_days)
      VALUES ($1, $2, $3, $4)
      RETURNING id, year;
    `;

    const insertedYears = [];
    for (const y of years_data) {
      const { year, total_students, total_days } = y;
      const result = await client.query(yearQuery, [
        baseId,
        year,
        total_students ?? null,
        total_days ?? null
      ]);
      insertedYears.push(result.rows[0]);
    }

    // 3️⃣ Insert mess bills for students (only for specified years)
    const yearsInt = years_data.map(y => parseInt(y.year, 10));

    const insertBillsQuery = `
      INSERT INTO public.mess_bill_for_students
        (student_id, monthly_year_data_id, number_of_days, monthly_base_cost_id)
      SELECT 
        s.id AS student_id,
        m.id AS monthly_year_data_id,
        COALESCE(m.total_days, 30) AS number_of_days,
        b.id AS monthly_base_cost_id
      FROM public.students s
      JOIN public.monthly_year_data m
        ON s.academic_year::int = m.year
      JOIN public.monthly_base_costs b
        ON m.monthly_base_id = b.id
      WHERE b.month_year = $1
        AND m.year = ANY($2::int[]);
    `;

    const billResult = await client.query(insertBillsQuery, [month_year, yearsInt]);

    await client.query('COMMIT');

    res.status(201).json({
      message: `Monthly calculation and mess bills created successfully for ${month_year}`,
      base_id: baseId,
      year_data_inserted: insertedYears,
      bills_inserted_count: billResult.rowCount
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in createMonthlyCalculation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
