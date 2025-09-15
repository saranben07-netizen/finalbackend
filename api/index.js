import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const api = express();
api.use(express.json());
api.use(cookieParser());

// ✅ Manual CORS middleware (top of stack)
api.use(cors());

// Routers
import studentsupdaterouter from "../routers/studentsupdaterouter.js";
import emailpushrouter from "../routers/emailpushrouter.js";
import emailverifyrouter from "../routers/emailverifyrouter.js";
import sendcoderouter from "../routers/sendcoderouter.js";
import registerrouter from "../routers/registerrouter.js";
import fetchstudentrouter from "../routers/fetchstudentsrouter.js";
import approverouter from "../routers/approverouter.js";
import studentLoginRouter from "../routers/studentsLoginRouter.js";
import adminLoginRouter from "../routers/adminLoginRouter.js";
import editstudentsdetailsrouter from "../routers/editstudentsdetailsrouter.js";
import attendancerouter from "../routers/attendancerouter.js";
import showattendancerouter from "../routers/showattendance.js";

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

// Root route
api.get("/", (req, res) => {
  res.json({ message: "API is running ✅" });
});

api.listen(3000)
