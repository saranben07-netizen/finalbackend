// routes/monthlyCalculation.js
import express from 'express';
import  updateShowToStudentsByDeptYear  from '../../../controllers/admin/mesbill/bulkshowstudents.js'; // adjust path

const updateshowstudentsbydeptyear = express.Router();

// Route to create monthly calculation
updateshowstudentsbydeptyear.post('/bulkshowmessbill', updateShowToStudentsByDeptYear);

export default  updateshowstudentsbydeptyear;   