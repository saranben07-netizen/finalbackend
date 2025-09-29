import express from "express";
import adminLoginController from "../../../controllers/admin/login/adminLoginController.js";
const adminLoginRouter = express.Router();
adminLoginRouter.use("/adminslogin",adminLoginController)
export default adminLoginRouter