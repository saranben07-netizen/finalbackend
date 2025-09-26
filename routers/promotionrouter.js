import express from "express";
import promotion from "../controllers/promotion.js";
import authorisation from "../controllers/authorisation.js";
const promotionrouter = express.Router();
promotionrouter.use("/promotion",authorisation,promotion);
export default promotionrouter;