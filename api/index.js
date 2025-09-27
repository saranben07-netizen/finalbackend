import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// Create express app
const api = express();

api.use(express.json({ limit: "10mb" })); 
api.use(express.urlencoded({ limit: "10mb", extended: true }));

api.use(cookieParser());

// ✅ Allow ALL origins + credentials


api.use(
  cors({
    origin: true,   // reflect request origin
    credentials: true,
  })
);


// ✅ Import routers
import studentsupdaterouter from "../routers/studentsupdaterouter.js";
import emailpushrouter from "../routers/emailpushrouter.js";
import resolvecomplaintsforadmins from "../routers/resolvecomplaintsforadmins.js";
import editcomplaintrouter from "../routers/editcomplaintrouter.js";
import emailverifyrouter from "../routers/emailverifyrouter.js";
import sendcoderouter from "../routers/sendcoderouter.js";
import registerrouter from "../routers/registerrouter.js";
import fetchstudentrouter from "../routers/fetchstudentsrouter.js";
import approverouter from "../routers/approverouter.js";
import studentLoginRouter from "../routers/studentsLoginRouter.js";
import adminLoginRouter from "../routers/adminLoginRouter.js";
import editstudentsdetailsrouter from "../routers/editstudentsdetailsrouter.js";
import attendancerouter from "../routers/attendancerouter.js";
import fetchcomplaintforadminrouter from "../routers/fetchcomplaintforadminsrouter.js";
import showattendancerouter from "../routers/showattendance.js";
import registercomplaintrouter from "../routers/registercomplaintrouter.js";
import fetchcomplaintsforstudentsrouter from "../routers/fetchcomplaintsforstudentsrouter.js";
import complaintstatuschangeforadminrouter from "../routers/complaintstatuschangeforadminrouter.js";
import forgotpasswordemailpushrouter from "../routers/forgotpasswordemailpushrouter.js";
import forgotpasswordsendcoderouter from "../routers/forgotpasswordsendcoderouter.js";
import verifycodeforgotrouter from "../routers/verifycodeforgotrouter.js";
import changepassowordrouter from "../routers/changepasswordrouter.js";
import test from "../routers/test.js";
import adminrejectrouter from "../routers/adminrejectrouter.js";
import absentrouter from "../routers/absentrouter.js";
import changeattendanceforadminrouter from "../routers/changeattendancebyadminrouter.js";
import adddepartmentsrouter from "../routers/adddepartmentsrouter.js";
import fetchdepartmentsrouter from "../routers/fetchdepartmentsrouter.js";
import editdepartmentrouter from "../routers/editdepartmentrouter.js";
import promotionrouter from "../routers/promotionrouter.js";
import exportAttendancerouter from "../routers/exportattendancerouter.js";
import pushannocementrouter from "../routers/pushannocement.js";
import editannouncementforadminrouter from "../routers/editannouncementrouter.js";
import fetchannocementrouter from "../routers/fetchannocementrouter.js";
import deletedepartmentrouter from "../routers/deletedepartmentrouter.js";
import sendNotificationToStudentsrouter from "../routers/sendnotificationrouter.js";
import fetchNotificationForStudentsrouter from "../routers/fetchNotificationForStudentsrouter.js";
import dismissannouncementforstudentrouter from "../routers/dismissnotificationforstudentsrouter.js";
import pushmessbillrouter from "../routers/pushmessbillrouter.js";



// ✅ Use routers
api.use(emailpushrouter);
api.use(sendcoderouter);
api.use(emailverifyrouter);
api.use(registerrouter);
api.use(fetchstudentrouter);
api.use(approverouter);
api.use(studentsupdaterouter);
api.use(studentLoginRouter);
api.use(adminLoginRouter);
api.use(editstudentsdetailsrouter);
api.use(attendancerouter);
api.use(showattendancerouter);
api.use(registercomplaintrouter);
api.use(editstudentsdetailsrouter);
api.use(editcomplaintrouter);
api.use(fetchcomplaintforadminrouter);
api.use(fetchcomplaintsforstudentsrouter);
api.use(resolvecomplaintsforadmins);
api.use(complaintstatuschangeforadminrouter);
api.use(forgotpasswordemailpushrouter);
api.use(forgotpasswordsendcoderouter);
api.use(verifycodeforgotrouter);
api.use(changepassowordrouter);
api.use(test);
api.use(absentrouter);
api.use(adminrejectrouter);
api.use(changeattendanceforadminrouter);
api.use(adddepartmentsrouter);
api.use(fetchdepartmentsrouter);
api.use(editdepartmentrouter);
api.use(promotionrouter);
api.use(exportAttendancerouter);
api.use(pushannocementrouter);
api.use(fetchannocementrouter)
api.use(deletedepartmentrouter);
api.use(sendNotificationToStudentsrouter);
api.use(fetchNotificationForStudentsrouter);
api.use(editannouncementforadminrouter);
api.use(dismissannouncementforstudentrouter);
api.use(pushmessbillrouter);
// ✅ Root route
api.get("/", (req, res) => {
  res.json({ message: "API is running ✅" });
});


export default api