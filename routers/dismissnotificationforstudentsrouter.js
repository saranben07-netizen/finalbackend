import express from "express";
import dismissannouncementforstudent from "../controllers/dismissannouncementforstudent.js";
import studentauth from "../controllers/studentauth.js";
const dismissannouncementforstudentrouter = express.Router();
dismissannouncementforstudentrouter.use("/dismissnotificationforstudent",studentauth,dismissannouncementforstudent);
export default dismissannouncementforstudentrouter