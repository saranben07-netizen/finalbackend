import pool from '../../../database/database.js'; // adjust path

export const updateMessBill = async (req, res) => {
  const client = await pool.connect();

  try {
    const { mess_bill_id, status, number_of_days, latest_order_id } = req.body;

    if (!mess_bill_id) {
      return res.status(400).json({ error: "mess_bill_id is required" });
    }

    // 1️⃣ Build dynamic update query
    const fields = [];
    const values = [];
    let idx = 1;

    if (status !== undefined) {
      fields.push(`status = $${idx}`);
      values.push(status);
      idx++;
    }
    if (number_of_days !== undefined) {
      fields.push(`number_of_days = $${idx}`);
      values.push(number_of_days);
      idx++;
    }
    if (latest_order_id !== undefined) {
      fields.push(`latest_order_id = $${idx}`);
      values.push(latest_order_id);
      idx++;
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    // Add mess_bill_id to values
    values.push(mess_bill_id);

    const updateQuery = `
      UPDATE public.mess_bill_for_students
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${idx}
      RETURNING *;
    `;

    const result = await client.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mess bill not found" });
    }

    res.status(200).json({
      message: 'Mess bill updated successfully',
      updated_bill: result.rows[0]
    });

  } catch (error) {
    console.error('Error updating mess bill:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};
