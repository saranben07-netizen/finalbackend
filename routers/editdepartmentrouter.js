import express from "express";
import editdepartment from "../controllers/editdepartment.js";
import authorisation from "../controllers/authorisation.js";
const editdepartmentrouter = express.Router();
editdepartmentrouter.use("/editdepartment",authorisation,editdepartment)
export default editdepartmentrouter