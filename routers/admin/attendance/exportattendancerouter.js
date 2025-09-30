import express from "express";
import exportAttendance from "../../../controllers/admin/attendance/exportattendance.js";
import authorisation from "../../../controllers/authorisation.js";
const exportAttendancerouter = express.Router();
exportAttendancerouter.use("/exportattendance",authorisation,exportAttendance);
export default exportAttendancerouter