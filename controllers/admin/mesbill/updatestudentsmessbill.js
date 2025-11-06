import pool from '../../../database/database.js'; // adjust path

export const updateMessBill = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id, number_of_days, verified, isveg } = req.body;

    // 🔒 Validation
    if (!id) {
      return res.status(400).json({ error: "id (mess_bill_id) is required" });
    }

    // 🧠 Build dynamic update query
    const fields = [];
    const values = [];
    let idx = 1;

    if (number_of_days !== undefined) {
      fields.push(`number_of_days = $${idx}`);
      values.push(number_of_days);
      idx++;
    }

    if (verified !== undefined) {
      fields.push(`verified = $${idx}`);
      values.push(verified);
      idx++;
    }

    if (isveg !== undefined) {
      fields.push(`isveg = $${idx}`);
      values.push(isveg);
      idx++;
    }

    // If nothing to update
    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    // Add id (WHERE condition)
    values.push(id);

    // 🧩 Construct final query
    const updateQuery = `
      UPDATE public.mess_bill_for_students
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${idx}
      RETURNING *;
    `;

    // Execute update
    const result = await client.query(updateQuery, values);

    // Handle not found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mess bill not found" });
    }

    // ✅ Success
    res.status(200).json({
      message: "✅ Mess bill updated successfully",
      updated_bill: result.rows[0],
    });

  } catch (error) {
    console.error("❌ Error updating mess bill:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};
