import express from "express";
import sendNotificationToStudents from "../controllers/sendnotificationtostudents.js";
import authorisation from "../controllers/authorisation.js";
const sendNotificationToStudentsrouter = express.Router();
sendNotificationToStudentsrouter.use("/sendnotificationforstudents",authorisation,sendNotificationToStudents);
export default sendNotificationToStudentsrouter