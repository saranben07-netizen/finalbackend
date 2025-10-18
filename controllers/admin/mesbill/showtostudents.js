import pool from '../../../database/database.js'; // adjust path

export const updateShowToStudentsById = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id, show_to_students } = req.body;

    // Validate input
    if (!id || typeof show_to_students !== 'boolean') {
      return res.status(400).json({ error: "id and show_to_students(boolean) are required" });
    }

    const query = `
      UPDATE mess_bill_for_students
      SET show_to_students = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING id, student_id, show_to_students, updated_at
    `;
    const values = [show_to_students, id];

    const { rows } = await client.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Mess bill not found" });
    }

    return res.status(200).json({
      message: "show_to_students updated successfully",
      data: rows[0],
    });
  } catch (error) {
    console.error("Error updating show_to_students by id:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
};
