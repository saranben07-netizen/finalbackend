

import express from 'express';
import { getMessBillStatusByMonthYear } from '../../../controllers/admin/mesbill/getmessbillstatus.js';

const getmessbillstatus = express.Router();

// ✅ POST endpoint
getmessbillstatus.post('/getmessbillstatus', getMessBillStatusByMonthYear);

export default getmessbillstatus;
