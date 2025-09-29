import express from "express";
import changepassword from "../../controllers/forgot_password/changepassoword.js";
const changepassowordrouter = express.Router();
changepassowordrouter.post("/changepassword",changepassword);
export default changepassowordrouter;