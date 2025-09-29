import express from "express"
import sendcode from "../../controllers/account_creation/sendcode.js";
const sendcoderouter = express.Router();
sendcoderouter.post("/sendcode", sendcode);
export default sendcoderouter;
