import express from "express";
import registration from "../../controllers/account_creation/registeration.js";


const registerrouter = express.Router();

// ⚡ Rate limiter setup (for registration)

// Apply middleware to the /register route
registerrouter.use("/register",  registration);

export default registerrouter;
