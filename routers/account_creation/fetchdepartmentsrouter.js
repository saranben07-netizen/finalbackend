import express from "express";
import fetchdepartments from "../../controllers/account_creation/fetchdeparments.js";

const fetchdepartmentsrouter = express.Router();
fetchdepartmentsrouter.use("/fetchdepartments",fetchdepartments);
export default fetchdepartmentsrouter