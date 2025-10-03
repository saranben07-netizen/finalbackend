import express from "express";
import emailpush from "../../controllers/account_creation/emailpush.js";


const emailpushrouter = express.Router();

// ✅ Limit: 3 requests per 10 minutes per IP


// ✅ Attach limiter to the route
emailpushrouter.post("/emailpush",  emailpush);

export default emailpushrouter;
