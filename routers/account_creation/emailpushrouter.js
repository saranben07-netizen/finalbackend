import express from "express";
import emailpush from "../../controllers/account_creation/emailpush.js";

const emailpushrouter = express.Router();
emailpushrouter.post("/emailpush", emailpush);

export default emailpushrouter
