import express from "express";
import editannouncementforadmin from "../../../controllers/admin/announcement/editannouncement.js";
import authorisation from "../../../controllers/authorisation.js";
const editannouncementforadminrouter = express.Router();
editannouncementforadminrouter.use("/editannouncementforadmin",authorisation,editannouncementforadmin);
export default editannouncementforadminrouter;