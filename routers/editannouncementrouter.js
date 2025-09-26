import express from "express";
import editannouncementforadmin from "../controllers/editannouncementforadmin.js";
import authorisation from "../controllers/authorisation.js";
const editannouncementforadminrouter = express.Router();
editannouncementforadminrouter.use("/editannouncementforadmin",authorisation,editannouncementforadmin);
export default editannouncementforadminrouter;