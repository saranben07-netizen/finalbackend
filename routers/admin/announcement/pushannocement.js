import express from "express";
import pushannocement from "../../../controllers/admin/announcement/pushannocement.js";
import authorisation from "../../../controllers/authorisation.js";
const pushannocementrouter = express.Router();
pushannocementrouter.use("/pushannocement",authorisation,pushannocement);
export default pushannocementrouter