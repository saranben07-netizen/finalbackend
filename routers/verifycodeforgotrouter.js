import express from "express";
import veriycodeforgot from "../controllers/veriycodeforgot.js";
const verifycodeforgotrouter = express.Router();
verifycodeforgotrouter.use("/veriycodeforgot",veriycodeforgot);
export default verifycodeforgotrouter;

