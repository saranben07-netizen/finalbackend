import pool from "../../database/database.js";
 async function test1(req,res){

    const result = await pool.query(`DELETE FROM emailverificationforgot WHERE email = $1 `,["benmega500@gmail.com"]);
    if(result.rowCount >0){
        return res.json({success:true});
    }
    else{
         return res.json({success:false});
    }


}

export default test1
