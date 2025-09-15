import express from "express";
import authorisation from "../controllers/authorisation.js";
import showattendance from "../controllers/showattendance.js";
const showattendancerouter = express.Router();
showattendancerouter.use("/showattends",authorisation,showattendance);
export default showattendancerouter;