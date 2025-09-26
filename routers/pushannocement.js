import express from "express";
import pushannocement from "../controllers/pushannocement.js";
import authorisation from "../controllers/authorisation.js";
const pushannocementrouter = express.Router();
pushannocementrouter.use("/pushannocement",authorisation,pushannocement);
export default pushannocementrouter