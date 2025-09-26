import express from "express";
import deletedepartment from "../controllers/deletedepartment.js";
import authorisation from "../controllers/authorisation.js";
const deletedepartmentrouter = express.Router();
deletedepartmentrouter.use("/deletedepartment",authorisation,deletedepartment);
export default deletedepartmentrouter