// routes/monthlyCalculation.js
import express from 'express';
import { createMonthlyCalculation } from '../../../controllers/admin/mesbill/messbillpush.js'; // adjust path

const messbillpush = express.Router();

// Route to create monthly calculation
messbillpush.post('/create', createMonthlyCalculation);

export default  messbillpush;   