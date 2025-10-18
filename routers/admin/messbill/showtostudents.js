// routes/monthlyCalculation.js
import express from 'express';
import { updateShowToStudentsById } from '../../../controllers/admin/mesbill/showtostudents.js'; // adjust path

const updateshowmessbill = express.Router();

// Route to create monthly calculation
updateshowmessbill.post('/updatesshowmessbilltostudents', updateShowToStudentsById );

export default  updateshowmessbill;   