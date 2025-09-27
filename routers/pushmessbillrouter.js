import express from "express";
import pushmessbill from "../controllers/pushmessbill.js";
const pushmessbillrouter = express.Router();
pushmessbillrouter.use("/pushmessbill",pushmessbill);
export default pushmessbillrouter