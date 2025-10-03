import express from "express";
import sendcode from "../../controllers/account_creation/sendcode.js";


const sendcoderouter = express.Router();

// ✅ 5 requests per 10 minutes per IP

sendcoderouter.post("/sendcode",  sendcode);

export default sendcoderouter;
