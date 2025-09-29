import express from "express";
import fetchcomplaintforadmins from "../../../controllers/admin/complaint/fetchcomplaintforadmins.js";
import authorisation from "../../../controllers/authorisation.js";
const fetchcomplaintforadminrouter = express.Router();
fetchcomplaintforadminrouter.use("/fetchcomplaintforadmins",authorisation,fetchcomplaintforadmins);
export default fetchcomplaintforadminrouter;