import pool from '../../../database/database.js';

const showMessBillsByStudentId = async (req, res) => {
  const client = await pool.connect();

  try {
    const { student_id } = req.body; // or req.query for GET requests

    if (!student_id) {
      return res.status(400).json({ error: "student_id is required" });
    }

    const query = `
      SELECT 
        mb.id AS mess_bill_id,
        mb.student_id,
        mb.monthly_base_cost_id AS base_id,
        mb.monthly_year_data_id AS year_data_id,
        mb.number_of_days,
        mb.status,
        mb.latest_order_id,
        mb.created_at,
        mb.updated_at,
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
      LEFT JOIN monthly_base_costs mbc
        ON mb.monthly_base_cost_id = mbc.id
      WHERE mb.student_id = $1
        AND mb.show = true
        AND mb.status != 'SUCCESS'  -- Exclude paid bills
      ORDER BY mbc.month_year DESC NULLS LAST;
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
