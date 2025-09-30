import express from "express";
import deleteannouncement from "../../../controllers/admin/announcement/deleteannouncement.js";
import authorisation from "../../../controllers/authorisation.js";
const deleteannouncementrouter = express.Router();
deleteannouncementrouter.use("/deleteannounce",authorisation,deleteannouncement);
export default deleteannouncementrouter