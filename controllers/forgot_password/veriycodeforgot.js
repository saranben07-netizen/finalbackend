import pool from "../../database/database.js";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";

async function veriycodeforgot(req, res) {
  const { email, code ,token} = req.body;
  function generateRandomString(length = 10) {
      return randomstring.generate({
        length: length,
        charset: "alphanumeric!@#$%^&*()"
      });
    }
  const result = await pool.query(`SELECT * FROM  emailverificationforgot WHERE email = $1`, [email]);
    let decode;
try {
  decode = jwt.verify(token, process.env.SECRET_KEY);
} catch (err) {
  return res.json({ success: false, message: "Invalid or expired token" });
}

   if (decode.sequence != result.rows[0].sequence) {
  return res.json({ success: false, message: "Token mismatch" });
}

  var token1;
  if (result.rowCount == 0) {
    return res.json({ success: false, message: "No verification process found for this email. Please initiate the forgot password process." });
  }
  if( result.rows[0].entire_expire  && result.rows[0].entire_expire < new Date()){
      return res.json({success:false,error:" time out"})
    }
  if (result.rows[0].token == token && (result.rows[0].step == '3' || result.rows[0].step == '4') ) {

    if(result.rows[0].code==code){  
         const sequence =  generateRandomString();
        token1 = jwt.sign({ email,sequence }, process.env.SECRET_KEY);
        const updateverified = await pool.query("UPDATE emailverificationforgot SET verified = $1, step='4', token = $3 , sequence = $4 WHERE email = $2",[true,email,token1,sequence]);
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
