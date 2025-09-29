import express from "express";
import deleteannouncement from "../../../controllers/admin/announcement/deleteannouncement.js";
const deleteannouncementrouter = express.Router();
deleteannouncementrouter.use("/deleteannounce",deleteannouncement);
export default deleteannouncementrouter