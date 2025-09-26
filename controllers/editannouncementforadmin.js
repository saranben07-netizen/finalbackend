import pool from "../database/database.js";

async function editannouncementforadmin(req, res) {
  try {
    const { announcement_id, ...data } = req.body;

    // 1️⃣ Validate announcement_id
    if (!announcement_id) {
      return res.status(400).json({ success: false, message: "announcement_id is required" });
    }

    // 2️⃣ Remove null or empty values from the update data
    function cleanObject(obj) {
      return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== null && value !== "")
      );
    }

    const cleanedObject = cleanObject(data);

    if (Object.keys(cleanedObject).length === 0) {
      return res.status(400).json({ success: false, message: "At least one field must be provided to update" });
    }

    // 3️⃣ Build the SET clause dynamically
    const keys = Object.keys(cleanedObject);
    const values = Object.values(cleanedObject);
    const setString = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

    // Add announcement_id as the last parameter
    values.push(announcement_id);
    const query = `UPDATE annocements SET ${setString} WHERE id = $${values.length}`;

    // 4️⃣ Execute the UPDATE query
    const result = await pool.query(query, values);

    // 5️⃣ Check if any row was updated
    if (result.rowCount > 0) {
      return res.json({ success: true, message: "Announcement updated successfully" });
    } else {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

  } catch (error) {
    console.error("Error updating announcement:", error);
    return res.status(500).json({ success: false, message: "Server error while updating announcement" });
  }
}

export default editannouncementforadmin;
