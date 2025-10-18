// routes/monthlyCalculation.js
import express from 'express';
import { fetchMonthlyCalculations } from '../../../controllers/admin/mesbill/messbillshow.js'; // adjust path

const messbillshow = express.Router();

// Route to create monthly calculation
messbillshow.post('/show', fetchMonthlyCalculations);

export default  messbillshow;   