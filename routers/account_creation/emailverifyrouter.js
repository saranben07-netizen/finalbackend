import express from "express";
import emailverify from "../../controllers/account_creation/emailverify.js";


const emailverifyrouter = express.Router();

// ⚡ Rate limiter setup (for verification attempts)

// Apply middleware here ⬇️
emailverifyrouter.post("/emailverify", emailverify);

export default emailverifyrouter;
