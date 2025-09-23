import express from "express";
import adminreject from "../controllers/adminreject.js";
import studentauth from "../controllers/studentauth.js";
const adminrejectrouter = express.Router();
adminrejectrouter.use("/adminreject",studentauth,adminreject);
export default adminrejectrouter;