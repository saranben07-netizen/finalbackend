import express from "express";
import absent from "../controllers/adsent.js";
import studentauth from "../controllers/studentauth.js";
const absentrouter = express.Router();
absentrouter.use("/absent",studentauth,absent);
export default absentrouter;