// routes/messBillRoutes.js
import express from 'express';
import updateShowToStudentsByDeptYear from '../../../controllers/admin/mesbill/sendmessbilltostudents.js'; // adjust path

const  sendmessbilltostudentsrouter = express.Router();

// POST route to update show_to_students for multiple or filtered students
sendmessbilltostudentsrouter.post('/update-show-status', updateShowToStudentsByDeptYear);

export default  sendmessbilltostudentsrouter;
