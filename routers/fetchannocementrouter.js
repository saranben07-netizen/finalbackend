import express from "express";
import fetchannocement from "../controllers/fetchannocement.js";
import authorisation from "../controllers/authorisation.js";
const fetchannocementrouter = express.Router();
fetchannocementrouter.use("/fetchannocementforadmin",authorisation,fetchannocement);
export default fetchannocementrouter