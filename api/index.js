import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Create express app
const api = express();

api.use(express.json({ limit: "10mb" })); 
api.use(express.urlencoded({ limit: "10mb", extended: true }));

api.use(cookieParser());

// ✅ Allow ALL origins + credentials


api.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*"); // reflect request origin
    },
    credentials: true, // allow cookies / auth headers
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
// ✅ Root route
api.get("/", (req, res) => {
  res.json({ message: "API is running ✅" });
});



api.listen(3001);