import express from "express"
import registration from "../../controllers/account_creation/registeration.js";

const registerrouter = express.Router();
registerrouter.use("/register",registration);

export default registerrouter;