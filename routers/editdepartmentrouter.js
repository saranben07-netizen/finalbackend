import express from "express";
import editdepartment from "../controllers/editdepartment.js";
const editdepartmentrouter = express.Router();
editdepartmentrouter.use("/editdepartment",editdepartment)
export default editdepartmentrouter