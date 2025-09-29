import express from "express";
import adddepartments from "../../../controllers/admin/departments/adddepartmets.js";
import authorisation from "../../../controllers/authorisation.js";
const adddepartmentsrouter = express.Router();
adddepartmentsrouter.use("/adddepartments",authorisation,adddepartments);
export default adddepartmentsrouter;