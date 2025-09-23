import express from "express";
import changeattendancebyadmin from "../controllers/changeattendanceforadmin.js";
import authorisation from "../controllers/authorisation.js";
const changeattendanceforadminrouter = express.Router();
changeattendanceforadminrouter.use("/changeattendanceforadmin",authorisation,changeattendancebyadmin);
export default changeattendanceforadminrouter;