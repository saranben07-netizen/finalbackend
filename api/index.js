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






// 2️⃣ Callback route after Google login


// ✅ Import rout
import studentsupdaterouter from "../routers/admin/students/studentsupdaterouter.js"
import emailpushrouter from "../routers/account_creation/emailpushrouter.js";
import resolvecomplaintsforadmins from "../routers/admin/complaint/resolvecomplaintsforadmins.js";
import editcomplaintrouter from "../routers/student/complaints/editcomplaintrouter.js";
import emailverifyrouter from "../routers/account_creation/emailverifyrouter.js";
import sendcoderouter from "../routers/account_creation/sendcoderouter.js";
import registerrouter from "../routers/account_creation/registerrouter.js";
import fetchstudentrouter from "../routers/admin/students/fetchstudentsrouter.js";
import approverouter from "../routers/admin/approve_reject/approverouter.js";
import studentLoginRouter from "../routers/student/login/studentsLoginRouter.js";
import adminLoginRouter from "../routers/admin/login/adminLoginRouter.js";
import editstudentsdetailsrouter from "../routers/admin/students/editstudentsdetailsrouter.js";
import attendancerouter from "../routers/student/attendance/attendancerouter.js";
import fetchcomplaintforadminrouter from "../routers/admin/complaint/fetchcomplaintforadminsrouter.js";
import showattendancerouter from "../routers/admin/attendance/showattendance.js";
import registercomplaintrouter from "../routers/student/complaints/registercomplaintrouter.js";
import fetchcomplaintsforstudentsrouter from "../routers/student/complaints/fetchcomplaintsforstudentsrouter.js"
import complaintstatuschangeforadminrouter from "../routers/admin/complaint/resolvecomplaintsforadmins.js";
import forgotpasswordemailpushrouter from "../routers/forgot_password/forgotpasswordemailpushrouter.js";
import forgotpasswordsendcoderouter from "../routers/forgot_password/forgotpasswordsendcoderouter.js";
import verifycodeforgotrouter from "../routers/forgot_password/verifycodeforgotrouter.js";
import changepassowordrouter from "../routers/forgot_password/changepasswordrouter.js";
import adminrejectrouter from "../routers/admin/approve_reject/adminrejectrouter.js";
import absentrouter from "../routers/student/attendance/absentrouter.js";
import changeattendanceforadminrouter from "../routers/admin/attendance/changeattendancebyadminrouter.js";
import adddepartmentsrouter from "../routers/admin/department/adddepartmentsrouter.js";
import fetchdepartmentsrouter from "../routers/account_creation/fetchdepartmentsrouter.js";
import editdepartmentrouter from "../routers/admin/department/editdepartmentrouter.js";
import promotionrouter from "../routers/admin/promotion/promotionrouter.js"
import exportAttendancerouter from "../routers/admin/attendance/exportattendancerouter.js";
import pushannocementrouter from "../routers/admin/announcement/pushannocement.js";
import editannouncementforadminrouter from "../routers/admin/announcement/editannouncementrouter.js";
import fetchannocementrouter from "../routers/admin/announcement/fetchannocementrouter.js";
import deletedepartmentrouter from "../routers/admin/department/deletedepartmentrouter.js";
import fetchNotificationForStudentsrouter from "../routers/student/notification/fetchNotificationForStudentsrouter.js";
import dismissannouncementforstudentrouter from "../routers/student/notification/dismissnotification.js";
import deleteannouncementrouter from "../routers/admin/announcement/deleteannouncementrouter.js";
import logoutrouter from "../routers/admin/logout/logout.js";



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

api.use(fetchNotificationForStudentsrouter);
api.use(editannouncementforadminrouter);
api.use(dismissannouncementforstudentrouter);
api.use(deleteannouncementrouter);
api.use(logoutrouter);



// ✅ Root route
api.get("/", (req, res) => {
  res.json({ message: "API is running ✅" });
});

export default api