// routes/monthlyCalculation.js
import express from 'express';
import { upsertSingleMessBill } from '../../../controllers/admin/mesbill/insertstudentsmessbillnew.js'; // adjust path

const insertstudentmessbillnew = express.Router();

// Route to create monthly calculation
insertstudentmessbillnew.post('/insertstudentmessbillnew', upsertSingleMessBill);

export default   insertstudentmessbillnew;   