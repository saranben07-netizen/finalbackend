import express from "express";
import exportAttendance from "../../../controllers/admin/attendance/exportattendance.js";
const exportAttendancerouter = express.Router();
exportAttendancerouter.use("/exportattendance",exportAttendance);
export default exportAttendancerouter