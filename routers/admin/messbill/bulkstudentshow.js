// routes/monthlyCalculation.js
import express from 'express';
import  bulkUpdateShowForMessBills  from '../../../controllers/admin/mesbill/bulkshowstudents.js'; // adjust path

const updateshowstudentsbydeptyear = express.Router();

// Route to create monthly calculation
updateshowstudentsbydeptyear.post('/bulkshowmessbill', bulkUpdateShowForMessBills);

export default  updateshowstudentsbydeptyear;   