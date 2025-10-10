import pool from "../../../database/database.js";

async function changeattendancebyadmin(req, res) {
  try {
    const { attendance_id, update ,token,...data} = req.body;
    // normalize status
const status = req.body.update.trim().toLowerCase(); // or .toUpperCase() depending on your DB constraint


    // ✅ Validate input
    if (!update) {
      return res.status(400).json({
        success: false,
        message: "attendance_id and update (status) are required",token
      });
    }

    if(!attendance_id || attendance_id==""){
      const student_id = data.student_id;
       const query = `
      INSERT INTO public.attendance (student_id, status)
      VALUES ($1, $2)
      ON CONFLICT (student_id, date) DO NOTHING
      RETURNING *;
    `;
    const result = pool.query(query,[student_id,status])
    return res.json({success:true,token})
    }

    // ✅ Run update query
    const query = "UPDATE attendance SET status = $1 WHERE id = $2";
    const result = await pool.query(query, [status, attendance_id]);


    // ✅ Check if record exists
    if (result.rowCount > 0) {
      return res.status(200).json({
        success: true,
        message: "Attendance updated successfully",
        updated_id: attendance_id,token
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",token
      });
    }
  } catch (error) {
    console.error("Error updating attendance:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating attendance",
      error: error.message,token
    });
  }
}

export default changeattendancebyadmin;
