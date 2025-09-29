import express from "express";
import studentLoginController from "../../../controllers/student/login/studentLoginController.js";
const studentLoginRouter = express.Router();
studentLoginRouter.use("/studentslogin",studentLoginController)
export default studentLoginRouter
