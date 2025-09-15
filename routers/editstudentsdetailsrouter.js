import editstudentsdetails from "../controllers/editstudentsdetails.js";
import authorisation from "../controllers/authorisation.js";
import express from "express";
const editstudentsdetailsrouter = express.Router();
editstudentsdetailsrouter.use("/editstudentsdetails",authorisation,editstudentsdetails);
export default editstudentsdetailsrouter;