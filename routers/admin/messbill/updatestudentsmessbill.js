// routes/monthlyCalculation.js
import express from 'express';
import { updateMessBill  } from '../../../controllers/admin/mesbill/updatestudentsmessbill.js'; // adjust path

const updatemessbill = express.Router();

// Route to create monthly calculation
updatemessbill.post('/upadatemessbill', updateMessBill );

export default updatemessbill;   