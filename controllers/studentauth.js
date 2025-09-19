import jwt from "jsonwebtoken";
import refreshTokenHandler from "./refreshtoken.js";
async function studentauth(req,res,next){
 const token = req.body.token || req.headers["authorization"]?.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshToken);

  if (!token) {
    return res.status(401).json({ success: false, error: "Token missing" });
  }

    try{

        const decoded = jwt.verify(token,"mysecret");
        if(decoded.role==="student"){
            console.log(decoded.role);
            req.body.id = result.id;
              
            return next();


        }



    }

    catch(e){

       console.log("Access token expired, trying refresh...");

    // 3️⃣ Try refresh token if access expired
    if (!refreshToken) {
      return res.status(403).json({ success: false, error: "No refresh token" });
    }

    const result = await refreshTokenHandler(refreshToken);
    console.log(result);
    if (result.success) {
      
      // Set the new token in the request for the next middleware
      req.body.token = result.token;
      // Re-verify the new token to set req.user
      const newDecoded = jwt.verify(result.token, process.env.JWT_SECRET || "mysecret");
      req.body.id=newDecoded.id;
      console.log("kvfknv",req.body.id);
      if (newDecoded.role === "student") {
        req.user = newDecoded;
        return next();
      } else {
        return res.status(403).json({ success: false, error: "Forbidden: not student" });
      }
    }

    return res.status(403).json({ success: false, error: "Invalid refresh token" });


    }
}

export default studentauth;