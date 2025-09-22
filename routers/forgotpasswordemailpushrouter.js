import express from "express";
import forgotpasswordemailpush from "../controllers/forgotpasswordmailpush.js";
const forgotpasswordemailpushrouter = express.Router();
forgotpasswordemailpushrouter.use("/forgotpasswordemailpush",forgotpasswordemailpush);
export default forgotpasswordemailpushrouter;