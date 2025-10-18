// routes/monthlyCalculation.js
import express from 'express';
import { updateMonthlyCalculation  } from '../../../controllers/admin/mesbill/messbillupdate.js'; // adjust path

const messbillupdate = express.Router();

// Route to create monthly calculation
messbillupdate.post('/update', updateMonthlyCalculation );

export default  messbillupdate;   