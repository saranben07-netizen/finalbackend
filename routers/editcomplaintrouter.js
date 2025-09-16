import express from "express";
import editcomplaint from "../controllers/editcomplaint.js";
import studentauth from "../controllers/studentauth.js";
const editcomplaintrouter = express.Router();
editcomplaintrouter.put("/editcomplaints", studentauth,editcomplaint);
export default editcomplaintrouter;
