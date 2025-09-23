
import pool from "../database/database.js";
import bcrypt from "bcrypt";
async function changepassword(req,res) {

    
    const {email,password,token} = req.body;
    const result = await pool.query("SELECT *  FROM emailverificationforgot  WHERE  email = $1",[email]);
    if(result.rowCount === 0){
      return res.json({success:false})
    }
    if( result.rows[0].expires_at  &&  result.rows[0].expires_at < new Date()){
      return res.json({success:false,error:"timeout"})
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