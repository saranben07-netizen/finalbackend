import pool from '../../../database/database.js';

const showMessBillsByStudentId = async (req, res) => {
  const client = await pool.connect();

  try {
    // Use query params for GET request
    const { student_id } = req.body;

    if (!student_id) {
      return res.status(400).json({ error: "student_id is required" });
    }

    const query = `
      SELECT 
        mb.id AS mess_bill_id,
        mb.student_id,
        mb.monthly_base_cost_id AS base_id,
        mb.number_of_days,
        mb.show_to_students,
        mb.status, -- ✅ Added status column here
        mbc.month_year,
        mbc.grocery_cost,
        mbc.vegetable_cost,
        mbc.gas_charges,
        mbc.total_milk_litres,
        mbc.milk_cost_per_litre,
        mbc.milk_charges_computed,
        mbc.other_costs,
        mbc.total_expenditure,
        mbc.expenditure_after_income,
        mbc.mess_fee_per_day
      FROM mess_bill_for_students mb
      INNER JOIN monthly_base_costs mbc
        ON mb.monthly_base_cost_id = mbc.id
      WHERE mb.student_id = $1
      ORDER BY mbc.month_year DESC;
    `;

    const result = await client.query(query, [student_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No mess bills found for this student." });
    }

    res.json({
      success: true,
      message: "Mess bills fetched successfully",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching mess bills:", error);
    res.status(500).json({ error: "Failed to fetch mess bills" });
  } finally {
    client.release();
  }
};

export default showMessBillsByStudentId;
