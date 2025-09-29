import express from "express";
import emailverify from "../../controllers/account_creation/emailverify.js";

const emailverifyrouter = express.Router();
emailverifyrouter.post("/emailverify", emailverify);

export default emailverifyrouter;
