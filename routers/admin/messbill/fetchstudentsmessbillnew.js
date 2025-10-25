// routes/monthlyCalculation.js
import express from 'express';
import { fetchMessBills } from '../../../controllers/admin/mesbill/fetchstudentsmessbillnew.js'; // adjust path

const fetchstudentsmessbillnew = express.Router();

// Route to create monthly calculation
fetchstudentsmessbillnew.post('/fetchstudentsmessbillnew', fetchMessBills);

export default  fetchstudentsmessbillnew;   