import express from "express";
import exportAttendance from "../controllers/exportattendance.js";
const exportAttendancerouter = express.Router();
exportAttendancerouter.use("/exportattendance",exportAttendance);
export default exportAttendancerouter