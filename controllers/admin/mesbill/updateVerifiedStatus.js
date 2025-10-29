import pool from "../../../database/database.js";

export const updateVerifiedStatus = async (req, res) => {
  const client = await pool.connect();

  try {
    const { ids, verified } = req.body;

    // ✅ Validation
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Field 'ids' must be a non-empty array." });
    }

    if (typeof verified !== "boolean") {
      return res.status(400).json({ error: "Field 'verified' must be a boolean (true/false)." });
    }

    // ✅ Update query
    const query = `
      UPDATE mess_bill_for_students
      SET verified = $1,
          updated_at = NOW()
      WHERE id = ANY($2::bigint[])
      RETURNING id, verified;
    `;

    const result = await client.query(query, [verified, ids]);

    // ✅ If no rows affected
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No matching records found." });
    }

    res.status(200).json({
      message: `Updated ${result.rowCount} record(s) successfully.`,
      updated: result.rows
    });
  } catch (error) {
    console.error("❌ Error updating verified status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
};
