import express from "express";
import veriycodeforgot from "../../controllers/forgot_password/veriycodeforgot.js";
const verifycodeforgotrouter = express.Router();
verifycodeforgotrouter.use("/veriycodeforgot",veriycodeforgot);
export default verifycodeforgotrouter;

