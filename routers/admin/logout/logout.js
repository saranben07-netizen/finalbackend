import express from "express";
import logout from "../../../controllers/admin/logout/logout.js";
const logoutrouter = express.Router();
logoutrouter.use("/logout",logout);
export default logoutrouter;