import express from "express";
import fetchdepartments from "../controllers/fetchdeparments.js";
const fetchdepartmentsrouter = express.Router();
fetchdepartmentsrouter.use("/fetchdepartments",fetchdepartments);
export default fetchdepartmentsrouter