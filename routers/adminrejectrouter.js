import express from "express";
import adminreject from "../controllers/adminreject.js";
const adminrejectrouter = express.Router();
adminreject.use("/adminreject",adminrejectrouter);
export default adminrejectrouter;