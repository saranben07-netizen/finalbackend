// routes/monthlyCalculation.js
import express from 'express';
import { upsertSingleMessBill } from '../../../controllers/admin/mesbill/insertstudentmessbill.js'; // adjust path

const insertstudentmessbill = express.Router();

// Route to create monthly calculation
insertstudentmessbill.post('/insertstudentmessbill', upsertSingleMessBill);

export default   insertstudentmessbill;   