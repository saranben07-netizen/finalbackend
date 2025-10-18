// routes/monthlyCalculation.js
import express from 'express';
import { fetchMessBills } from '../../../controllers/admin/mesbill/fetchstudentsmessbill.js'; // adjust path

const fetchstudentsmessbill = express.Router();

// Route to create monthly calculation
fetchstudentsmessbill.post('/fetchstudentsmessbill', fetchMessBills);

export default  fetchstudentsmessbill;   