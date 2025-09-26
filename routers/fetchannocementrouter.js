import express from "express";
import fetchannocement from "../controllers/fetchannocement.js";
const fetchannocementrouter = express.Router();
fetchannocementrouter.use("/fetchannocement",fetchannocement);
export default fetchannocementrouter