import express from "express";
import dismissnotification from "../../../controllers/student/notification/dismissnotification.js";
import studentauth from "../../../controllers/studentauth.js";
const dismissnotificationrouter= express.Router();
dismissnotificationrouter.use("/dismissnotificationforstudent",studentauth,dismissnotification);
export default dismissnotificationrouter