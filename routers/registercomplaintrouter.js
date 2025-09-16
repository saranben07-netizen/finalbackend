import express from "express";
import studentauth from "../controllers/studentauth.js";
import registercomplaint from "../controllers/registercomplaint.js";
const registercomplaintrouter = express.Router();
registercomplaintrouter.post("/registercomplaints", studentauth, registercomplaint);
export default registercomplaintrouter;
