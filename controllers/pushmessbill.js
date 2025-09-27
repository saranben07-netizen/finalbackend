import pool from "../database/database.js";

async function pushmessbill(req, res) {
  try {
    const {
      grocery_cost,
      vegetable_cost,
      gas_charges,
      total_milk_litres,
      milk_cost_per_litre,
      milk_charges,
      other_costs,
      income_or_deductions,
      "1st_year_students_count": first_year_students_count,
      "1st_year_days_count": first_year_days_count,
      "2nd_year_students_count": second_year_students_count,
      "2nd_year_days_count": second_year_days_count,
      "3rd_year_students_count": third_year_students_count,
      "3rd_year_days_count": third_year_days_count,
      "4th_year_students_count": fourth_year_students_count,
      "4th_year_days_count": fourth_year_days_count,
      total_students,
      reduction_days,
      veg_extra_per_day,
      "non_veg_extra_per_day": non_veg_extra_per_day,
      charge_per_day,
      month,
      year,
    } = req.body;

    // 1️⃣ Basic validation
    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required",
      });
    }

    // 2️⃣ Insert query
    const query = `
      INSERT INTO public.monthly_mess_info (
        grocery_cost,
        vegetable_cost,
        gas_charges,
        total_milk_litres,
        milk_cost_per_litre,
        milk_charges,
        other_costs,
        income_or_deductions,
        "1st_year_students_count",
        "1st_year_days_count",
        "2nd_year_students_count",
        "2nd_year_days_count",
        "3rd_year_students_count",
        "3rd_year_days_count",
        "4th_year_students_count",
        "4th_year_days_count",
        total_students,
        reduction_days,
        veg_extra_per_day,
        non_veg_extra_per_day,
        charge_per_day,
        month,
        year
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20,
        $21, $22, $23
      )
      RETURNING *;
    `;

    const values = [
      grocery_cost,
      vegetable_cost,
      gas_charges,
      total_milk_litres,
      milk_cost_per_litre,
      milk_charges,
      other_costs,
      income_or_deductions,
      first_year_students_count,
      first_year_days_count,
      second_year_students_count,
      second_year_days_count,
      third_year_students_count,
      third_year_days_count,
      fourth_year_students_count,
      fourth_year_days_count,
      total_students,
      reduction_days,
      veg_extra_per_day,
      non_veg_extra_per_day,
      charge_per_day,
      month,
      year,
    ];

    // 3️⃣ Execute query
    const result = await pool.query(query, values);

    // 4️⃣ Success response
    if (result.rowCount > 0) {
      return res.json({
        success: true,
        message: "Mess bill added successfully",
        data: result.rows[0],
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to insert mess bill",
      });
    }
  } catch (error) {
    console.error("Error inserting mess bill:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while inserting mess bill",
      error: error.message,
    });
  }
}

export default pushmessbill;
