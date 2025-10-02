import pool from "../../database/database.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import randomstring from "randomstring";

async function forgotpasswordsendcode(req, res) {
  
    const {email,token} = req.body;
    //for handling empty email field
    if(!email || !token){
        return res.json({success:false,message:"Email is required"});

    }

    let decode;
try {
  decode = jwt.verify(token, process.env.SECRET_KEY);
} catch (err) {
  return res.json({ success: false, message: "Invalid or expired token" });
}


    var token1;

    const result = await pool.query(`SELECT * FROM  emailverificationforgot WHERE email = $1`,[email]);
   if (decode.sequence != result.rows[0].sequence) {
  return res.json({ success: false, message: "Token mismatch" });
}

    if(result.rowCount==0){
        return res.json({success:false,message:"No verification process found for this email. Please initiate the forgot password process."});
    }

    if( result.rows[0].entire_expire  && result.rows[0].entire_expire < new Date()){
      return res.json({success:false,error:" time out"})
    }
    if( result.rows[0].expires_at  && result.rows[0].expires_at > new Date()){
      return res.json({success:false,error:"wait for 5 minutes code already send"})
    }
    function generateRandomString(length = 10) {
      return randomstring.generate({
        length: length,
        charset: "alphanumeric!@#$%^&*()"
      });
    }


    if(result.rows[0].token == token && (result.rows[0].step=='2' || result.rows[0].step=='3')){

        const code = Math.floor(100000 + Math.random() * 900000);
        const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "benmega500@gmail.com",
                pass: "xsozotdvwyrqpgiu"
              }
            });
        
            const mailOptions = {
              from: "benmega500@gmail.com",
              to: email,
              subject: "Your Verification Code",
              text: `Your verification code is: ${code}`
            };
        
        await transporter.sendMail(mailOptions);
         const sequence =  generateRandomString();
        token1 = jwt.sign({ email,sequence }, process.env.SECRET_KEY);
        const updateResult = await pool.query(
  `UPDATE emailverificationforgot 
   SET code = $2, expires_at = NOW() + interval '5 minutes', step = '3', token = $3, sequence = $4 
   WHERE email = $1`,
  [email, code, token1,sequence]
);
        return res.json({success:true,message:"Code sent to email",code:code,token:token1});



    }

    else{
      
      return res.json({success:false,message:"Invalid token or step"});
    }



   
}

export default forgotpasswordsendcode;
