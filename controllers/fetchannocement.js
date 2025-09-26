import pool from "../database/database.js";

async function fetchannocement(req, res) {
  const { token, ...data } = req.body;


  function cleanObject(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== null && value !== "")
    );
  }

  const cleanedObject = cleanObject(data);
   if (Object.keys(cleanedObject).length  > 0) {

          const keys = Object.keys(cleanedObject);
          const values = Object.values(cleanedObject);
          console.log(values)
          const whereString = keys.map((key, i) => `${key} = $${i + 1}`).join(" AND ");
          const query =`SELECT  * FROM  annocements  WHERE ${whereString}`
          console.log(query,values);
          const result = await pool.query(query,values);
          console.log(result)
          return res.json({success:true,data:result.rows});
   }
 

  try {
    const result = await pool.query(`SELECT * FROM annocements`);

    if (result.rowCount > 0) {
      return res.json({
        success: true,
        announcements: result.rows,
      });
    } else {
      return res.json({
        success: false,
        message: "No announcements found",
      });
    }
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching announcements",
    });
  }
}

export default fetchannocement;
