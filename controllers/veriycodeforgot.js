import pool from "../database/database.js";
import jwt from "jsonwebtoken";

async function veriycodeforgot(req, res) {
  const { email, code ,token} = req.body;
  const result = await pool.query(`SELECT * FROM  emailverificationforgot WHERE email = $1`, [email]);
  const token1 = jwt.sign({ email }, process.env.SECRET_KEY);
  if (result.rowCount == 0) {
    return res.json({ success: false, message: "No verification process found for this email. Please initiate the forgot password process." });
  }
  if( result.rows[0].expires_at  && result.rows[0].expires_at < new Date()){
      return res.json({success:false,error:"timeout"})
    }
  if (result.rows[0].token == token && (result.rows[0].step == '3' || result.rows[0].step == '4') ) {

    if(result.rows[0].code==code){  
        const updateverified = await pool.query("UPDATE emailverificationforgot SET verified = $1, step='4', token = $3 WHERE email = $2",[true,email,token1]);
        return res.json({ success: true, message: "Email verified successfully",token:token1 });
    }
    else{
        return res.json({ success: false, message: "Invalid code" });
    }
  }
  else {

    return res.json({ success: false, message: "Invalid token or step" });
  }

 
}

export default veriycodeforgot;
