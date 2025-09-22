import express from "express";
import forgotpasswordsendcode from "../controllers/forgotpasswordsendcode.js";
const forgotpasswordsendcoderouter = express.Router();
forgotpasswordsendcoderouter.use("/forgotpasswordsendcode",forgotpasswordsendcode);
export default forgotpasswordsendcoderouter;