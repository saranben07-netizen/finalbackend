
import pool from "../../database/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
async function changepassword(req,res) {

    
    const {email,password,token} = req.body;
    const result = await pool.query("SELECT *  FROM emailverificationforgot  WHERE  email = $1",[email]);
   let decode;
try {
  decode = jwt.verify(token, process.env.SECRET_KEY);
} catch (err) {
  return res.json({ success: false, message: "Invalid or expired token" });
}

   if (decode.sequence != result.rows[0].sequence) {
  return res.json({ success: false, message: "Token mismatch" });
}

    if(result.rowCount === 0){
      return res.json({success:false})
    }
    if( result.rows[0].entire_expire  && result.rows[0].entire_expire < new Date()){
      return res.json({success:false,error:" time out"})
    }
    if((result.rows[0].step == '4' || result.rows[0].step == '5') && result.rows[0].token === token  && result.rows[0].verified=== true){
       const hashedPassword = await bcrypt.hash(password, 10);

      const update1 = await pool.query(`UPDATE students SET password = $1 WHERE email = $2`,[hashedPassword,email]);
      if(update1.rowCount > 0){
         await pool.query(`DELETE FROM emailverificationforgot WHERE email = $1`, [email]);

          return  res.json({success:true ,message:"password changed successfully"})
      }

      else{
        console.log(update1);
      }
      console.log(update1);

      


    }

    else{
      return res.json({success:false,error:"first verify the email"})
    }
}
export default changepassword;