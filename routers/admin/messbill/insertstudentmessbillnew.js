// routes/monthlyCalculation.js
import express from 'express';
import { updateNumberOfDays } from '../../../controllers/admin/mesbill/insertstudentsmessbillnew.js'; // adjust path

const insertstudentmessbillnew = express.Router();

// Route to create monthly calculation
insertstudentmessbillnew.post('/insertstudentmessbillnew', updateNumberOfDays);

export default   insertstudentmessbillnew;   