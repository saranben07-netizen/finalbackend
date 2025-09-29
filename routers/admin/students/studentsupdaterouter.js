import express from "express";
import authorisation from "../../../controllers/authorisation.js";
import studentsupdate from "../../../controllers/admin/student/studentsupdate.js";
const studentsupdaterouter = express.Router();
studentsupdaterouter.use("/studentupdate",authorisation,studentsupdate);
export default studentsupdaterouter