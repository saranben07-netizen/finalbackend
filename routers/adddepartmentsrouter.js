import express from "express";
import adddepartments from "../controllers/adddepartmets.js";
const adddepartmentsrouter = express.Router();
adddepartmentsrouter.use("/adddepartments",adddepartments);
export default adddepartmentsrouter;