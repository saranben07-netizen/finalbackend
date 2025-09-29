import express from "express";
import fetchstudent from "../../../controllers/admin/student/fetchstudents.js";
import authorisation from "../../../controllers/authorisation.js";
const fetchstudentrouter = express.Router();
fetchstudentrouter.post("/fetchstudents", authorisation,fetchstudent);
export default fetchstudentrouter
