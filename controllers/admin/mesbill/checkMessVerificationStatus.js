import pool from "../../../database/database.js";

// ✅ Controller function to check and update mess verification progress
export const checkMessVerificationStatus = async (req, res) => {
  const { monthYear } = req.body;

  try {
    // 1️⃣ Get the monthly_base_costs.id for the given monthYear
    const baseRes = await pool.query(
      "SELECT id, progress_stage FROM monthly_base_costs WHERE month_year = $1",
      [monthYear]
    );

    if (baseRes.rowCount === 0) {
      return res.status(404).json({ error: "Month-year not found" });
    }

    const baseId = baseRes.rows[0].id;

    // 2️⃣ Count total and verified students for that month
    const countRes = await pool.query(
      `SELECT 
         COUNT(*)::int AS total_students,
         COUNT(*) FILTER (WHERE verified = true)::int AS verified_students,
         COUNT(*) FILTER (WHERE verified = false)::int AS unverified_students
       FROM public.mess_bill_for_students
       WHERE monthly_base_cost_id = $1`,
      [baseId]
    );

    const { total_students, verified_students, unverified_students } = countRes.rows[0];
    const verified_percent =
      total_students > 0 ? ((verified_students / total_students) * 100).toFixed(2) : 0;

    // 3️⃣ If all are verified, update progress_stage and return success
    if (verified_students === total_students && total_students > 0) {
      await pool.query(
        `UPDATE public.monthly_base_costs 
         SET progress_stage = 'FULLY_VERIFIED'
         WHERE id = $1`,
        [baseId]
      );

      return res.json({
        monthYear,
        message: "✅ All students verified. Progress updated to FULLY_VERIFIED.",
        progress_stage: "FULLY_VERIFIED",
        total_students,
        verified_students,
        verified_percent,
      });
    }

    // 4️⃣ If not all verified, show breakdown by department & academic year
    const deptQuery = `
      SELECT 
        s.department,
        s.academic_year,
        COUNT(mbfs.id)::int AS total_students,
        COUNT(*) FILTER (WHERE mbfs.verified = true)::int AS verified_students,
        COUNT(*) FILTER (WHERE mbfs.verified = false)::int AS unverified_students
      FROM public.mess_bill_for_students mbfs
      JOIN public.students s ON s.id = mbfs.student_id
      WHERE mbfs.monthly_base_cost_id = $1
      GROUP BY s.department, s.academic_year
      ORDER BY s.department, s.academic_year;
    `;

    const deptRes = await pool.query(deptQuery, [baseId]);

    // 5️⃣ Update stage to PARTIALLY_VERIFIED
    await pool.query(
      `UPDATE public.monthly_base_costs 
       SET progress_stage = 'PARTIALLY_VERIFIED'
       WHERE id = $1`,
      [baseId]
    );

    return res.json({
      monthYear,
      progress_stage: "PARTIALLY_VERIFIED",
      total_students,
      verified_students,
      unverified_students,
      verified_percent,
      department_wise_status: deptRes.rows,
    });

  } catch (error) {
    console.error("❌ Error verifying progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
