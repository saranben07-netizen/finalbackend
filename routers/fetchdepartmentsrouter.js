import express from "express";
import fetchdepartments from "../controllers/fetchdeparments.js";
import authorisation from "../controllers/authorisation.js";
const fetchdepartmentsrouter = express.Router();
fetchdepartmentsrouter.use("/fetchdepartments",authorisation,fetchdepartments);
export default fetchdepartmentsrouter