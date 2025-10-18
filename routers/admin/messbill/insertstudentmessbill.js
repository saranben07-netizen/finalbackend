// routes/monthlyCalculation.js
import express from 'express';
import { insertMessBillForMonth } from '../../../controllers/admin/mesbill/insertstudentmessbill.js'; // adjust path

const insertstudentmessbill = express.Router();

// Route to create monthly calculation
insertstudentmessbill.post('/insertstudentmessbill', insertMessBillForMonth);

export default   insertstudentmessbill;   